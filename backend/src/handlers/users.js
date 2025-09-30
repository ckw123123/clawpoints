const { v4: uuidv4 } = require('uuid');
const { dynamodb, tables } = require('../utils/dynamodb');
const { success, badRequest, notFound, internalError } = require('../utils/response');

const getUser = async (event) => {
  try {
    const { id } = event.pathParameters;
    
    const params = {
      TableName: tables.USERS,
      Key: { id }
    };

    const result = await dynamodb.get(params).promise();
    
    if (!result.Item) {
      return notFound('User not found');
    }

    // Get user's branch info
    if (result.Item.branch_id) {
      const branchParams = {
        TableName: tables.BRANCHES,
        Key: { id: result.Item.branch_id }
      };
      
      const branchResult = await dynamodb.get(branchParams).promise();
      result.Item.branch = branchResult.Item;
    }

    return success(result.Item);
  } catch (error) {
    console.error('Error getting user:', error);
    return internalError('Failed to get user');
  }
};

const updateUser = async (event) => {
  try {
    const { id } = event.pathParameters;
    const body = JSON.parse(event.body);
    
    const { name, gender, birthday, phone, email } = body;
    
    const params = {
      TableName: tables.USERS,
      Key: { id },
      UpdateExpression: 'SET #name = :name, gender = :gender, birthday = :birthday, phone = :phone, email = :email',
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ExpressionAttributeValues: {
        ':name': name,
        ':gender': gender,
        ':birthday': birthday,
        ':phone': phone,
        ':email': email
      },
      ReturnValues: 'ALL_NEW'
    };

    const result = await dynamodb.update(params).promise();
    
    return success(result.Attributes);
  } catch (error) {
    console.error('Error updating user:', error);
    return internalError('Failed to update user');
  }
};

const searchMembers = async (event) => {
  try {
    const { q } = event.queryStringParameters || {};
    
    if (!q || q.trim().length < 2) {
      return badRequest('Search query must be at least 2 characters');
    }

    const params = {
      TableName: tables.USERS,
      FilterExpression: 'contains(#name, :query) OR contains(login_name, :query)',
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ExpressionAttributeValues: {
        ':query': q.toLowerCase()
      }
    };

    const result = await dynamodb.scan(params).promise();
    
    // Limit results to 20 for performance
    const members = result.Items.slice(0, 20).map(user => ({
      id: user.id,
      name: user.name,
      username: user.login_name,
      points: user.points || 0
    }));

    return success({ members });
  } catch (error) {
    console.error('Error searching members:', error);
    return internalError('Failed to search members');
  }
};

module.exports = {
  getUser,
  updateUser,
  searchMembers
};