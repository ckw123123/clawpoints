const { v4: uuidv4 } = require('uuid');
const { dynamodb, tables } = require('../utils/dynamodb');
const { success, badRequest, notFound, internalError } = require('../utils/response');

const getUserTransactions = async (event) => {
  try {
    const { id } = event.pathParameters;
    
    const params = {
      TableName: tables.TRANSACTIONS,
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'user_id = :userId',
      ExpressionAttributeValues: {
        ':userId': id
      },
      ScanIndexForward: false // Sort by created_at descending
    };

    const result = await dynamodb.query(params).promise();
    
    // Get branch names for transactions
    const transactionsWithBranches = await Promise.all(
      result.Items.map(async (transaction) => {
        if (transaction.branch_id) {
          try {
            const branchParams = {
              TableName: tables.BRANCHES,
              Key: { id: transaction.branch_id }
            };
            const branchResult = await dynamodb.get(branchParams).promise();
            transaction.branch_name = branchResult.Item?.name;
          } catch (error) {
            console.error('Error getting branch for transaction:', error);
          }
        }
        return transaction;
      })
    );

    return success({ transactions: transactionsWithBranches });
  } catch (error) {
    console.error('Error getting user transactions:', error);
    return internalError('Failed to get transactions');
  }
};

const createTransaction = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { userId, points, type, itemName, branchId } = body;
    
    if (!userId || !points || !type || !itemName) {
      return badRequest('Missing required fields');
    }

    if (type !== 'add' && type !== 'redeem') {
      return badRequest('Invalid transaction type');
    }

    // Get current user points
    const userParams = {
      TableName: tables.USERS,
      Key: { id: userId }
    };

    const userResult = await dynamodb.get(userParams).promise();
    
    if (!userResult.Item) {
      return notFound('User not found');
    }

    const currentPoints = userResult.Item.points || 0;
    
    // Check if user has enough points for redemption
    if (type === 'redeem' && currentPoints < points) {
      return badRequest('Insufficient points');
    }

    const newPoints = type === 'add' ? currentPoints + points : currentPoints - points;
    
    // Create transaction record
    const transactionId = uuidv4();
    const timestamp = new Date().toISOString();
    
    const transactionParams = {
      TableName: tables.TRANSACTIONS,
      Item: {
        id: transactionId,
        user_id: userId,
        type,
        item_name: itemName,
        points,
        branch_id: branchId,
        created_at: timestamp
      }
    };

    // Update user points
    const updateUserParams = {
      TableName: tables.USERS,
      Key: { id: userId },
      UpdateExpression: 'SET points = :points',
      ExpressionAttributeValues: {
        ':points': newPoints
      }
    };

    // Execute both operations
    await Promise.all([
      dynamodb.put(transactionParams).promise(),
      dynamodb.update(updateUserParams).promise()
    ]);

    return success({
      transactionId,
      newBalance: newPoints,
      message: `Successfully ${type === 'add' ? 'added' : 'redeemed'} ${points} points`
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return internalError('Failed to create transaction');
  }
};

module.exports = {
  getUserTransactions,
  createTransaction
};