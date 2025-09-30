const { dynamodb, tables } = require('../utils/dynamodb');
const { success, badRequest, internalError } = require('../utils/response');

// FAQ responses in both languages
const FAQ_RESPONSES = {
  'points_expiry': {
    'en': 'Your points never expire! They remain in your account as long as you stay active.',
    'zh': '您的積分永不過期！只要您保持活躍，積分就會一直保留在您的帳戶中。'
  },
  'earn_points': {
    'en': 'You can earn points by purchasing items at our stores. Each purchase gives you points based on the item value.',
    'zh': '您可以通過在我們的商店購買商品來賺取積分。每次購買都會根據商品價值給您積分。'
  },
  'use_points': {
    'en': 'You can use your points at any of our branch locations to redeem prizes and get discounts.',
    'zh': '您可以在我們任何分店使用積分兌換獎品和獲得折扣。'
  },
  'contact_support': {
    'en': 'For additional support, please visit any of our branch locations or contact our customer service.',
    'zh': '如需更多支援，請造訪我們任何分店或聯絡我們的客戶服務。'
  }
};

// Helper function to detect language
const detectLanguage = (inputText) => {
  // Simple language detection based on Chinese characters
  const chineseRegex = /[\u4e00-\u9fff]/;
  return chineseRegex.test(inputText) ? 'zh' : 'en';
};

// Helper function to get user from session attributes or context
const getUserIdFromSession = (event) => {
  // Try to get user ID from session attributes first
  if (event.sessionAttributes && event.sessionAttributes.userId) {
    return event.sessionAttributes.userId;
  }
  
  // Try to get from request context (for webhook calls)
  if (event.requestContext && event.requestContext.authorizer && event.requestContext.authorizer.claims) {
    return event.requestContext.authorizer.claims.sub;
  }
  
  // For testing purposes, return a default user ID
  return null;
};

// Handle CheckPointsIntent
const handleCheckPoints = async (userId, language) => {
  try {
    if (!userId) {
      return language === 'zh' 
        ? '抱歉，我無法識別您的身份。請重新登入。'
        : 'Sorry, I cannot identify you. Please log in again.';
    }

    const params = {
      TableName: tables.USERS,
      Key: { id: userId }
    };

    const result = await dynamodb.get(params).promise();
    
    if (!result.Item) {
      return language === 'zh' 
        ? '找不到您的帳戶資料。'
        : 'Cannot find your account information.';
    }

    const points = result.Item.points || 0;
    
    return language === 'zh' 
      ? `您目前有 ${points.toLocaleString()} 積分。`
      : `You currently have ${points.toLocaleString()} points.`;
      
  } catch (error) {
    console.error('Error checking points:', error);
    return language === 'zh' 
      ? '查詢積分時發生錯誤，請稍後再試。'
      : 'Error checking points. Please try again later.';
  }
};

// Handle RedeemIntent
const handleRedeem = async (language) => {
  try {
    const params = {
      TableName: tables.PRIZES,
      FilterExpression: 'stock > :zero',
      ExpressionAttributeValues: {
        ':zero': 0
      }
    };

    const result = await dynamodb.scan(params).promise();
    
    if (!result.Items || result.Items.length === 0) {
      return language === 'zh' 
        ? '目前沒有可兌換的獎品。'
        : 'No prizes available for redemption at the moment.';
    }

    // Sort by cost_points ascending
    const prizes = result.Items.sort((a, b) => a.cost_points - b.cost_points);
    
    let response = language === 'zh' 
      ? '以下是可兌換的獎品：\n\n'
      : 'Here are the available prizes for redemption:\n\n';
    
    prizes.forEach((prize, index) => {
      if (index < 5) { // Limit to top 5 prizes
        response += language === 'zh' 
          ? `🎁 ${prize.name} - ${prize.cost_points} 積分 (庫存: ${prize.stock})\n`
          : `🎁 ${prize.name} - ${prize.cost_points} points (Stock: ${prize.stock})\n`;
      }
    });
    
    if (prizes.length > 5) {
      response += language === 'zh' 
        ? `\n還有更多獎品可供選擇！`
        : `\nAnd more prizes available!`;
    }
    
    return response;
    
  } catch (error) {
    console.error('Error getting prizes:', error);
    return language === 'zh' 
      ? '查詢獎品時發生錯誤，請稍後再試。'
      : 'Error getting prizes. Please try again later.';
  }
};

// Handle FAQIntent
const handleFAQ = (inputText, language) => {
  const lowerInput = inputText.toLowerCase();
  
  // Detect FAQ topic based on keywords
  if (lowerInput.includes('expire') || lowerInput.includes('過期') || lowerInput.includes('有效期')) {
    return FAQ_RESPONSES.points_expiry[language];
  } else if (lowerInput.includes('earn') || lowerInput.includes('賺') || lowerInput.includes('獲得')) {
    return FAQ_RESPONSES.earn_points[language];
  } else if (lowerInput.includes('use') || lowerInput.includes('用') || lowerInput.includes('使用')) {
    return FAQ_RESPONSES.use_points[language];
  } else {
    return FAQ_RESPONSES.contact_support[language];
  }
};

// Main Lex fulfillment handler
const fulfillment = async (event) => {
  console.log('Lex Event:', JSON.stringify(event, null, 2));
  
  try {
    const intentName = event.currentIntent?.name || event.interpretations?.[0]?.intent?.name;
    const inputText = event.inputTranscript || event.transcriptions?.[0]?.transcription || '';
    const userId = getUserIdFromSession(event);
    const language = detectLanguage(inputText);
    
    let responseMessage = '';
    
    switch (intentName) {
      case 'CheckPointsIntent':
        responseMessage = await handleCheckPoints(userId, language);
        break;
        
      case 'RedeemIntent':
        responseMessage = await handleRedeem(language);
        break;
        
      case 'FAQIntent':
        responseMessage = handleFAQ(inputText, language);
        break;
        
      default:
        responseMessage = language === 'zh' 
          ? '抱歉，我不明白您的問題。您可以問我關於積分餘額、可兌換獎品或常見問題。'
          : 'Sorry, I don\'t understand your question. You can ask me about your points balance, available prizes, or frequently asked questions.';
    }
    
    // Lex V2 response format
    const response = {
      sessionState: {
        dialogAction: {
          type: 'Close'
        },
        intent: {
          name: intentName,
          state: 'Fulfilled'
        }
      },
      messages: [
        {
          contentType: 'PlainText',
          content: responseMessage
        }
      ]
    };
    
    console.log('Lex Response:', JSON.stringify(response, null, 2));
    return response;
    
  } catch (error) {
    console.error('Lex fulfillment error:', error);
    
    const errorMessage = detectLanguage(event.inputTranscript || '') === 'zh'
      ? '系統發生錯誤，請稍後再試。'
      : 'System error occurred. Please try again later.';
    
    return {
      sessionState: {
        dialogAction: {
          type: 'Close'
        },
        intent: {
          name: event.currentIntent?.name || 'FallbackIntent',
          state: 'Failed'
        }
      },
      messages: [
        {
          contentType: 'PlainText',
          content: errorMessage
        }
      ]
    };
  }
};

// Check if chatbot is enabled
const isChatbotEnabled = async () => {
  try {
    const params = {
      TableName: tables.SETTINGS,
      Key: { key: 'chatbot_enabled' }
    };
    
    const result = await dynamodb.get(params).promise();
    return result.Item ? result.Item.value : false;
  } catch (error) {
    console.error('Error checking chatbot settings:', error);
    return false; // Default to disabled on error
  }
};

// Webhook for frontend integration
const webhook = async (event) => {
  try {
    // Check if chatbot is enabled
    const chatbotEnabled = await isChatbotEnabled();
    if (!chatbotEnabled) {
      return success({
        message: 'Chatbot service is currently unavailable. Please contact customer support.',
        timestamp: new Date().toISOString()
      });
    }

    const body = JSON.parse(event.body);
    const { message, userId } = body;
    
    if (!message) {
      return badRequest('Message is required');
    }
    
    const language = detectLanguage(message);
    
    // Simple intent detection for webhook
    let response = '';
    const lowerMessage = message.toLowerCase();
    
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
      response = handleFAQ(message, language);
    } else {
      response = language === 'zh' 
        ? '您好！我可以幫您查詢積分餘額、可兌換獎品或回答常見問題。請問有什麼可以幫到您？'
        : 'Hello! I can help you check your points balance, available prizes, or answer frequently asked questions. How can I help you?';
    }
    
    return success({
      message: response,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return internalError('Failed to process message');
  }
};

module.exports = {
  fulfillment,
  webhook
};