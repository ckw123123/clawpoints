const AWS = require('aws-sdk');

// Configure AWS
AWS.config.update({ region: 'us-east-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();

const SETTINGS_TABLE = 'membership-points-api-settings-dev';

const initializeSettings = async () => {
  const defaultSettings = [
    {
      key: 'chatbot_enabled',
      value: false,
      description: 'Enable or disable AI chatbot functionality',
      updated_at: new Date().toISOString()
    },
    {
      key: 'whatsapp_integration_enabled',
      value: false,
      description: 'Enable or disable WhatsApp chatbot integration',
      updated_at: new Date().toISOString()
    },
    {
      key: 'instagram_integration_enabled',
      value: false,
      description: 'Enable or disable Instagram DM chatbot integration',
      updated_at: new Date().toISOString()
    }
  ];

  console.log('Initializing default settings...');

  for (const setting of defaultSettings) {
    try {
      // Check if setting already exists
      const getParams = {
        TableName: SETTINGS_TABLE,
        Key: { key: setting.key }
      };

      const existingItem = await dynamodb.get(getParams).promise();
      
      if (!existingItem.Item) {
        // Setting doesn't exist, create it
        const putParams = {
          TableName: SETTINGS_TABLE,
          Item: setting
        };

        await dynamodb.put(putParams).promise();
        console.log(`✓ Created setting: ${setting.key} = ${setting.value}`);
      } else {
        console.log(`- Setting already exists: ${setting.key} = ${existingItem.Item.value}`);
      }
    } catch (error) {
      console.error(`✗ Error processing setting ${setting.key}:`, error);
    }
  }

  console.log('Settings initialization completed!');
};

// Run the initialization
initializeSettings().catch(console.error);