import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext-demo';

const Chatbot = ({ isOpen, onClose }) => {
  const { userProfile } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initialize with welcome message
      const welcomeMessage = language === 'zh' 
        ? '您好！我是智能客服助手。我可以幫您查詢積分餘額、可兌換獎品或回答常見問題。請問有什麼可以幫到您？'
        : 'Hello! I\'m your AI customer service assistant. I can help you check your points balance, available prizes, or answer frequently asked questions. How can I help you?';
      
      setMessages([{
        id: 1,
        text: welcomeMessage,
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
  }, [isOpen, language, messages.length]);

  // Demo responses
  const getDemoResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('point') || lowerMessage.includes('積分') || lowerMessage.includes('點數')) {
      if (lowerMessage.includes('how many') || lowerMessage.includes('幾多') || lowerMessage.includes('餘額')) {
        return language === 'zh' 
          ? `您目前有 ${userProfile?.points?.toLocaleString() || '1,250'} 積分。`
          : `You currently have ${userProfile?.points?.toLocaleString() || '1,250'} points.`;
      }
    }
    
    if (lowerMessage.includes('redeem') || lowerMessage.includes('換') || lowerMessage.includes('獎品')) {
      return language === 'zh' 
        ? '以下是可兌換的獎品：\n\n🎁 免費咖啡 - 100 積分\n🎁 三明治 - 250 積分\n🎁 $10 禮品卡 - 500 積分\n🎁 $25 禮品卡 - 1000 積分\n🎁 T恤 - 750 積分'
        : 'Here are the available prizes for redemption:\n\n🎁 Free Coffee - 100 points\n🎁 Sandwich - 250 points\n🎁 $10 Gift Card - 500 points\n🎁 $25 Gift Card - 1000 points\n🎁 T-Shirt - 750 points';
    }
    
    if (lowerMessage.includes('expire') || lowerMessage.includes('過期')) {
      return language === 'zh' 
        ? '您的積分永不過期！只要您保持活躍，積分就會一直保留在您的帳戶中。'
        : 'Your points never expire! They remain in your account as long as you stay active.';
    }
    
    if (lowerMessage.includes('earn') || lowerMessage.includes('賺')) {
      return language === 'zh' 
        ? '您可以通過在我們的商店購買商品來賺取積分。每次購買都會根據商品價值給您積分。'
        : 'You can earn points by purchasing items at our stores. Each purchase gives you points based on the item value.';
    }
    
    // Default response
    return language === 'zh' 
      ? '謝謝您的問題！這是一個演示版本。在實際應用中，我會連接到真實的數據庫來為您提供準確的信息。'
      : 'Thank you for your question! This is a demo version. In the real application, I would connect to actual databases to provide you with accurate information.';
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const response = getDemoResponse(currentMessage);
      
      const botMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = [
    {
      text: language === 'zh' ? '查詢積分' : 'Check Points',
      message: language === 'zh' ? '我有幾多積分？' : 'How many points do I have?'
    },
    {
      text: language === 'zh' ? '可兌換獎品' : 'Available Prizes',
      message: language === 'zh' ? '有咩獎品可以換？' : 'What prizes can I redeem?'
    },
    {
      text: language === 'zh' ? '積分過期' : 'Points Expiry',
      message: language === 'zh' ? '積分幾時過期？' : 'When do my points expire?'
    }
  ];

  const handleQuickAction = (message) => {
    setInputMessage(message);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 md:items-center">
      <div className="bg-white w-full h-full md:w-96 md:h-[600px] md:rounded-lg shadow-xl flex flex-col">
        {/* Header */}
        <div className="bg-primary-600 text-white p-4 flex justify-between items-center md:rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              🤖
            </div>
            <div>
              <h3 className="font-semibold">
                {language === 'zh' ? '智能客服 (演示)' : 'AI Assistant (Demo)'}
              </h3>
              <p className="text-xs text-primary-100">
                {language === 'zh' ? '在線' : 'Online'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
              className="px-2 py-1 bg-white bg-opacity-20 rounded text-xs hover:bg-opacity-30"
            >
              {language === 'zh' ? 'EN' : '中'}
            </button>
            <button
              onClick={onClose}
              className="text-white hover:text-primary-200"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length <= 1 && (
          <div className="px-4 py-2 border-t border-gray-200">
            <p className="text-xs text-gray-600 mb-2">
              {language === 'zh' ? '快速選項：' : 'Quick actions:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.message)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200"
                >
                  {action.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={language === 'zh' ? '輸入訊息...' : 'Type a message...'}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {language === 'zh' ? '發送' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;