const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

const tables = {
  USERS: process.env.USERS_TABLE,
  TRANSACTIONS: process.env.TRANSACTIONS_TABLE,
  ITEMS: process.env.ITEMS_TABLE,
  PRIZES: process.env.PRIZES_TABLE,
  BRANCHES: process.env.BRANCHES_TABLE,
  SETTINGS: process.env.SETTINGS_TABLE
};

module.exports = {
  dynamodb,
  tables
};