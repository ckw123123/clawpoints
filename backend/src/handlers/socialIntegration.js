const { dynamodb, tables } = require('../utils/dynamodb');
const { success, badRequest, internalError } = require('../utils/response');

// Check if WhatsApp integration is enabled
const isWhatsAppEnabled = async () => {
  try {
    const params = {
      TableName: tables.SETTINGS,
      Key: { key: 'whatsapp_integration_enabled' }
    };
    
    const result = await dynamodb.get(params).promise();
    return result.Item ? result.Item.value : false;
  } catch (error) {
    console.error('Error checking WhatsApp settings:', error);
    return false;
  }
};

// Check if Instagram integration is enabled
const isInstagramEnabled = async () => {
  try {
    const params = {
      TableName: tables.SETTINGS,
      Key: { key: 'instagram_integration_enabled' }
    };
    
    const result = await dynamodb.get(params).promise();
    return result.Item ? result.Item.value : false;
  } catch (error) {
    console.error('Error checking Instagram settings:', error);
    return false;
  }
};

// WhatsApp webhook handler (using Twilio)
const whatsappWebhook = async (event) => {
  try {
    // Check if WhatsApp integration is enabled
    const whatsappEnabled = await isWhatsAppEnabled();
    if (!whatsappEnabled) {
      const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>WhatsApp chatbot service is currently unavailable. Please visit our store or use our mobile app.</Message>
</Response>`;
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/xml' },
        body: twimlResponse
      };
    }

    const body = JSON.parse(event.body);
    console.log('WhatsApp webhook received:', body);

    // Twilio WhatsApp webhook format
    const { From, Body, ProfileName } = body;
    
    if (!From || !Body) {
      return badRequest('Missing required fields');
    }

    // Extract phone number (remove whatsapp: prefix)
    const phoneNumber = From.replace('whatsapp:', '');
    
    // Try to find user by phone number
    let userId = null;
    try {
      const userParams = {
        TableName: tables.USERS,
        FilterExpression: 'phone = :phone',
        ExpressionAttributeValues: {
          ':phone': phoneNumber
        }
      };
      
      const userResult = await dynamodb.scan(userParams).promise();
      if (userResult.Items && userResult.Items.length > 0) {
        userId = userResult.Items[0].id;
      }
    } catch (error) {
      console.error('Error finding user by phone:', error);
    }

    // Process message through our chatbot logic
    const { handleCheckPoints, handleRedeem, handleFAQ } = require('./lexBot');
    
    const language = detectLanguage(Body);
    let response = '';
    const lowerMessage = Body.toLowerCase();
    
    if (lowerMessage.includes('point') || lowerMessage.includes('積分') || lowerMessage.includes('點數')) {
      if (lowerMessage.includes('how many') || lowerMessage.includes('幾多') || lowerMessage.includes('餘額')) {
        response = await handleCheckPoints(userId, language);
      } else {
        response = await handleRedeem(language);
      }
    } else if (lowerMessage.includes('redeem') || lowerMessage.includes('換') || lowerMessage.includes('獎品')) {
      response = await handleRedeem(language);
    } else if (lowerMessage.includes('expire') || lowerMessage.includes('過期') || 
               lowerMessage.includes('earn') || lowerMessage.includes('賺') ||
               lowerMessage.includes('use') || lowerMessage.includes('用')) {
      response = handleFAQ(Body, language);
    } else {
      response = language === 'zh' 
        ? `您好 ${ProfileName || ''}！我是會員積分智能助手。我可以幫您查詢積分餘額、可兌換獎品或回答常見問題。請問有什麼可以幫到您？`
        : `Hello ${ProfileName || ''}! I'm your membership points AI assistant. I can help you check your points balance, available prizes, or answer frequently asked questions. How can I help you?`;
    }

    // Return TwiML response for WhatsApp
    const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${response}</Message>
</Response>`;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/xml'
      },
      body: twimlResponse
    };

  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    return internalError('Failed to process WhatsApp message');
  }
};

// Instagram webhook handler (using Facebook Graph API)
const instagramWebhook = async (event) => {
  try {
    // Check if Instagram integration is enabled
    const instagramEnabled = await isInstagramEnabled();
    if (!instagramEnabled) {
      return success({ message: 'Instagram integration is currently disabled' });
    }

    const body = JSON.parse(event.body);
    console.log('Instagram webhook received:', body);

    // Facebook webhook verification
    if (event.queryStringParameters && event.queryStringParameters['hub.mode'] === 'subscribe') {
      const verifyToken = event.queryStringParameters['hub.verify_token'];
      const challenge = event.queryStringParameters['hub.challenge'];
      
      // Verify the token (you should set this in environment variables)
      if (verifyToken === process.env.INSTAGRAM_VERIFY_TOKEN) {
        return {
          statusCode: 200,
          body: challenge
        };
      } else {
        return badRequest('Invalid verify token');
      }
    }

    // Process Instagram message
    if (body.object === 'instagram') {
      const entries = body.entry || [];
      
      for (const entry of entries) {
        const messaging = entry.messaging || [];
        
        for (const message of messaging) {
          if (message.message && message.message.text) {
            const senderId = message.sender.id;
            const messageText = message.message.text;
            
            // Process message through chatbot logic
            const language = detectLanguage(messageText);
            let response = '';
            const lowerMessage = messageText.toLowerCase();
            
            if (lowerMessage.includes('point') || lowerMessage.includes('積分') || lowerMessage.includes('點數')) {
              response = await handleRedeem(language);
            } else if (lowerMessage.includes('redeem') || lowerMessage.includes('換') || lowerMessage.includes('獎品')) {
              response = await handleRedeem(language);
            } else {
              response = language === 'zh' 
                ? '您好！我是會員積分智能助手。由於隱私考慮，請使用我們的手機應用程式查詢個人積分資料。我可以為您介紹可兌換的獎品。'
                : 'Hello! I\'m your membership points AI assistant. For privacy reasons, please use our mobile app to check personal points information. I can show you available prizes for redemption.';
            }

            // Send response back to Instagram (you'll need to implement the Graph API call)
            await sendInstagramMessage(senderId, response);
          }
        }
      }
    }

    return success({ message: 'Instagram webhook processed' });

  } catch (error) {
    console.error('Instagram webhook error:', error);
    return internalError('Failed to process Instagram message');
  }
};

// Helper function to send Instagram message
const sendInstagramMessage = async (recipientId, messageText) => {
  // This would use Facebook Graph API to send message
  // Implementation depends on your Instagram Business Account setup
  console.log(`Sending Instagram message to ${recipientId}: ${messageText}`);
  
  // Example implementation:
  /*
  const axios = require('axios');
  const response = await axios.post(`https://graph.facebook.com/v18.0/me/messages`, {
    recipient: { id: recipientId },
    message: { text: messageText }
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.INSTAGRAM_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
  */
};

// Helper function to detect language (same as in lexBot.js)
const detectLanguage = (inputText) => {
  const chineseRegex = /[\u4e00-\u9fff]/;
  return chineseRegex.test(inputText) ? 'zh' : 'en';
};

module.exports = {
  whatsappWebhook,
  instagramWebhook
};