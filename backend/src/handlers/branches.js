const { dynamodb, tables } = require('../utils/dynamodb');
const { success, internalError } = require('../utils/response');

const getBranches = async (event) => {
  try {
    const params = {
      TableName: tables.BRANCHES
    };

    const result = await dynamodb.scan(params).promise();
    
    return success({ branches: result.Items });
  } catch (error) {
    console.error('Error getting branches:', error);
    return internalError('Failed to get branches');
  }
};

module.exports = {
  getBranches
};