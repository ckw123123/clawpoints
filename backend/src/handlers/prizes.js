const { dynamodb, tables } = require('../utils/dynamodb');
const { success, notFound, internalError } = require('../utils/response');

const getPrizes = async (event) => {
  try {
    const params = {
      TableName: tables.PRIZES
    };

    const result = await dynamodb.scan(params).promise();
    
    return success({ prizes: result.Items });
  } catch (error) {
    console.error('Error getting prizes:', error);
    return internalError('Failed to get prizes');
  }
};

const updatePrize = async (event) => {
  try {
    const { id } = event.pathParameters;
    const body = JSON.parse(event.body);
    const { stock, cost_points } = body;
    
    const updateExpression = [];
    const expressionAttributeValues = {};
    
    if (stock !== undefined) {
      updateExpression.push('stock = :stock');
      expressionAttributeValues[':stock'] = stock;
    }
    
    if (cost_points !== undefined) {
      updateExpression.push('cost_points = :cost_points');
      expressionAttributeValues[':cost_points'] = cost_points;
    }
    
    if (updateExpression.length === 0) {
      return badRequest('No fields to update');
    }

    const params = {
      TableName: tables.PRIZES,
      Key: { id },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };

    const result = await dynamodb.update(params).promise();
    
    if (!result.Attributes) {
      return notFound('Prize not found');
    }

    return success(result.Attributes);
  } catch (error) {
    console.error('Error updating prize:', error);
    return internalError('Failed to update prize');
  }
};

module.exports = {
  getPrizes,
  updatePrize
};