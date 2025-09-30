const { dynamodb, tables } = require('../utils/dynamodb');
const { success, internalError } = require('../utils/response');

const getItems = async (event) => {
  try {
    const params = {
      TableName: tables.ITEMS
    };

    const result = await dynamodb.scan(params).promise();
    
    return success({ items: result.Items });
  } catch (error) {
    console.error('Error getting items:', error);
    return internalError('Failed to get items');
  }
};

module.exports = {
  getItems
};