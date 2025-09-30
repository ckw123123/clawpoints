const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Configure AWS
AWS.config.update({ region: 'us-east-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();

const tables = {
  BRANCHES: 'membership-points-api-branches-dev',
  ITEMS: 'membership-points-api-items-dev',
  PRIZES: 'membership-points-api-prizes-dev',
  SETTINGS: 'membership-points-api-settings-dev'
};

const seedBranches = async () => {
  const branches = [
    {
      id: uuidv4(),
      name: 'Downtown Branch',
      location: '123 Main St, Downtown'
    },
    {
      id: uuidv4(),
      name: 'Mall Branch',
      location: '456 Shopping Center, Mall District'
    },
    {
      id: uuidv4(),
      name: 'Airport Branch',
      location: '789 Terminal Rd, Airport'
    }
  ];

  for (const branch of branches) {
    const params = {
      TableName: tables.BRANCHES,
      Item: branch
    };

    try {
      await dynamodb.put(params).promise();
      console.log(`Created branch: ${branch.name}`);
    } catch (error) {
      console.error(`Error creating branch ${branch.name}:`, error);
    }
  }
};

const seedItems = async () => {
  const items = [
    {
      id: uuidv4(),
      name: 'Coffee - Small',
      barcode: '1234567890123',
      points_value: 10
    },
    {
      id: uuidv4(),
      name: 'Coffee - Medium',
      barcode: '1234567890124',
      points_value: 15
    },
    {
      id: uuidv4(),
      name: 'Coffee - Large',
      barcode: '1234567890125',
      points_value: 20
    },
    {
      id: uuidv4(),
      name: 'Sandwich',
      barcode: '1234567890126',
      points_value: 25
    },
    {
      id: uuidv4(),
      name: 'Pastry',
      barcode: '1234567890127',
      points_value: 15
    },
    {
      id: uuidv4(),
      name: 'Salad',
      barcode: '1234567890128',
      points_value: 30
    }
  ];

  for (const item of items) {
    const params = {
      TableName: tables.ITEMS,
      Item: item
    };

    try {
      await dynamodb.put(params).promise();
      console.log(`Created item: ${item.name}`);
    } catch (error) {
      console.error(`Error creating item ${item.name}:`, error);
    }
  }
};

const seedPrizes = async () => {
  const prizes = [
    {
      id: uuidv4(),
      name: 'Free Coffee',
      cost_points: 100,
      stock: 50,
      branch_id: null // Available at all branches
    },
    {
      id: uuidv4(),
      name: 'Free Sandwich',
      cost_points: 250,
      stock: 30,
      branch_id: null
    },
    {
      id: uuidv4(),
      name: 'Gift Card $10',
      cost_points: 500,
      stock: 20,
      branch_id: null
    },
    {
      id: uuidv4(),
      name: 'Gift Card $25',
      cost_points: 1000,
      stock: 10,
      branch_id: null
    },
    {
      id: uuidv4(),
      name: 'T-Shirt',
      cost_points: 750,
      stock: 15,
      branch_id: null
    }
  ];

  for (const prize of prizes) {
    const params = {
      TableName: tables.PRIZES,
      Item: prize
    };

    try {
      await dynamodb.put(params).promise();
      console.log(`Created prize: ${prize.name}`);
    } catch (error) {
      console.error(`Error creating prize ${prize.name}:`, error);
    }
  }
};

const seedSettings = async () => {
  const settings = [
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

  for (const setting of settings) {
    const params = {
      TableName: tables.SETTINGS,
      Item: setting
    };

    try {
      await dynamodb.put(params).promise();
      console.log(`Created setting: ${setting.key} = ${setting.value}`);
    } catch (error) {
      console.error(`Error creating setting ${setting.key}:`, error);
    }
  }
};

const seedData = async () => {
  console.log('Starting data seeding...');
  
  try {
    await seedBranches();
    await seedItems();
    await seedPrizes();
    await seedSettings();
    
    console.log('Data seeding completed successfully!');
  } catch (error) {
    console.error('Error during data seeding:', error);
  }
};

// Run the seeding
seedData();