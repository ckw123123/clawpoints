const { dynamodb, tables } = require('../utils/dynamodb');
const { success, badRequest, unauthorized, internalError } = require('../utils/response');

// Check if user is admin
const isAdmin = (event) => {
  const groups = event.requestContext?.authorizer?.claims?.['cognito:groups'];
  return groups && groups.includes('admin');
};

const getSettings = async (event) => {
  try {
    // Get all settings
    const params = {
      TableName: tables.SETTINGS
    };

    const result = await dynamodb.scan(params).promise();
    
    // Convert array to object for easier frontend consumption
    const settings = {};
    result.Items.forEach(item => {
      settings[item.key] = item.value;
    });

    // Set default values if not exists
    const defaultSettings = {
      chatbot_enabled: false,
      whatsapp_integration_enabled: false,
      instagram_integration_enabled: false
    };

    const finalSettings = { ...defaultSettings, ...settings };

    return success(finalSettings);
  } catch (error) {
    console.error('Error getting settings:', error);
    return internalError('Failed to get settings');
  }
};

const updateSettings = async (event) => {
  try {
    // Only admins can update settings
    if (!isAdmin(event)) {
      return unauthorized('Admin access required');
    }

    const body = JSON.parse(event.body);
    
    if (!body || typeof body !== 'object') {
      return badRequest('Invalid settings data');
    }

    // Update each setting individually
    const updatePromises = Object.entries(body).map(async ([key, value]) => {
      const params = {
        TableName: tables.SETTINGS,
        Key: { key },
        UpdateExpression: 'SET #value = :value, updated_at = :timestamp',
        ExpressionAttributeNames: {
          '#value': 'value'
        },
        ExpressionAttributeValues: {
          ':value': value,
          ':timestamp': new Date().toISOString()
        },
        ReturnValues: 'ALL_NEW'
      };

      return dynamodb.update(params).promise();
    });

    await Promise.all(updatePromises);

    return success({
      message: 'Settings updated successfully',
      settings: body
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return internalError('Failed to update settings');
  }
};

module.exports = {
  getSettings,
  updateSettings
};