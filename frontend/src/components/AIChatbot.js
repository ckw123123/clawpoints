import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSharedData } from '../contexts/SharedDataContext-no-storage';
import { useDemoAuth } from './DemoAuthenticator';

const AIChatbot = () => {
  const { t, isChinese } = useLanguage();
  const { members, prizes, branches } = useSharedData();
  const { userType } = useDemoAuth();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Get current member data
  const memberData = userType === 'user' ? members.find(m => m.username === 'john_doe') : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 1,
        type: 'bot',
        text: isChinese 
          ? `你好！我是你的積分助手 🤖 我可以幫你查詢積分餘額、可兌換獎品、分店地址等資訊。有什麼可以幫到你？`
          : `Hello! I'm your points assistant 🤖 I can help you check your point balance, available prizes, branch addresses, and more. How can I help you?`,
        timestamp: new Date()
      }]);
    }
  }, [isChinese, messages.length]);

  const generateResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Point balance queries
    if (message.includes('point') || message.includes('balance') || message.includes('積分') || message.includes('餘額')) {
      return isChinese 
        ? `你目前的積分餘額是 ${memberData?.points?.toLocaleString() || 0} 分！💰 繼續購買商品賺取更多積分吧！`
        : `Your current point balance is ${memberData?.points?.toLocaleString() || 0} points! 💰 Keep earning more by making purchases!`;
    }

    // Prize queries
    if (message.includes('prize') || message.includes('reward') || message.includes('redeem') || message.includes('獎品') || message.includes('兌換') || message.includes('禮品')) {
      const availablePrizes = prizes.filter(p => p.cost_points <= (memberData?.points || 0));
      const allPrizes = prizes.slice(0, 3); // Show top 3 prizes
      
      if (isChinese) {
        let response = `🎁 可兌換獎品：\n\n`;
        if (availablePrizes.length > 0) {
          response += `你可以兌換的獎品：\n`;
          availablePrizes.forEach(prize => {
            response += `• ${prize.name} - ${prize.cost_points} 積分\n`;
          });
        } else {
          response += `你目前積分不足以兌換任何獎品。\n`;
        }
        response += `\n所有獎品：\n`;
        allPrizes.forEach(prize => {
          response += `• ${prize.name} - ${prize.cost_points} 積分\n`;
        });
        return response;
      } else {
        let response = `🎁 Available Prizes:\n\n`;
        if (availablePrizes.length > 0) {
          response += `You can redeem:\n`;
          availablePrizes.forEach(prize => {
            response += `• ${prize.name} - ${prize.cost_points} points\n`;
          });
        } else {
          response += `You don't have enough points for any prizes yet.\n`;
        }
        response += `\nAll prizes:\n`;
        allPrizes.forEach(prize => {
          response += `• ${prize.name} - ${prize.cost_points} points\n`;
        });
        return response;
      }
    }

    // Branch/location queries
    if (message.includes('branch') || message.includes('location') || message.includes('address') || message.includes('where') || message.includes('分店') || message.includes('地址') || message.includes('位置')) {
      if (isChinese) {
        let response = `📍 我們的分店地址：\n\n`;
        branches.forEach(branch => {
          response += `🏪 ${branch.name}\n`;
          response += `📞 ${branch.phone}\n`;
          response += `💬 WhatsApp: ${branch.whatsapp}\n\n`;
        });
        response += `你可以到任何一間分店使用積分！`;
        return response;
      } else {
        let response = `📍 Our Branch Locations:\n\n`;
        branches.forEach(branch => {
          response += `🏪 ${branch.nameEn}\n`;
          response += `📞 ${branch.phone}\n`;
          response += `💬 WhatsApp: ${branch.whatsapp}\n\n`;
        });
        response += `You can use your points at any of our locations!`;
        return response;
      }
    }

    // Hours/time queries
    if (message.includes('hour') || message.includes('time') || message.includes('open') || message.includes('close') || message.includes('營業') || message.includes('時間')) {
      return isChinese 
        ? `🕐 營業時間：每日上午10:00 - 晚上10:00\n\n所有分店都是相同營業時間。歡迎隨時光臨！`
        : `🕐 Opening Hours: Daily 10:00 AM - 10:00 PM\n\nAll branches have the same operating hours. Welcome anytime!`;
    }

    // How to earn points
    if (message.includes('earn') || message.includes('get') || message.includes('how') || message.includes('賺取') || message.includes('獲得') || message.includes('怎樣')) {
      return isChinese 
        ? `💡 賺取積分方法：\n\n• 購買咖啡：10-20 積分\n• 購買三明治：25 積分\n• 購買沙拉：30 積分\n• 購買糕點：15 積分\n\n每次購買後，請向店員出示你的QR碼即可獲得積分！`
        : `💡 How to Earn Points:\n\n• Buy Coffee: 10-20 points\n• Buy Sandwich: 25 points\n• Buy Salad: 30 points\n• Buy Pastry: 15 points\n\nShow your QR code to staff after each purchase to earn points!`;
    }

    // Default responses
    const defaultResponses = isChinese ? [
      `我可以幫你查詢積分餘額、可兌換獎品、分店地址等。請問你想了解什麼？`,
      `有什麼關於積分或獎品的問題嗎？我很樂意幫助你！`,
      `你可以問我關於積分、獎品、分店位置等問題喔！`
    ] : [
      `I can help you check your points, available prizes, branch locations, and more. What would you like to know?`,
      `Do you have any questions about points or prizes? I'm happy to help!`,
      `You can ask me about points, prizes, branch locations, and more!`
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    const messageToProcess = inputValue;
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        text: generateResponse(messageToProcess),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // 1-2 seconds delay
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!memberData) return null; // Only show for members

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <span className="text-2xl">🤖</span>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {isChinese ? '積分助手' : 'AI Points Assistant'}
          </h3>
          <p className="text-sm text-gray-600">
            {isChinese ? '問我任何關於積分和獎品的問題' : 'Ask me anything about your points and rewards'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto mb-4 p-3 bg-gray-50 rounded-lg space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg text-sm whitespace-pre-line ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800 border'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 px-3 py-2 rounded-lg text-sm border">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isChinese ? '輸入你的問題...' : 'Type your question...'}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputValue.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isChinese ? '發送' : 'Send'}
        </button>
      </div>

      {/* Quick Action Buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => {
            const question = isChinese ? '我有多少積分？' : 'How many points do I have?';
            const userMessage = {
              id: Date.now(),
              type: 'user',
              text: question,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, userMessage]);
            setIsTyping(true);
            setTimeout(() => {
              const botResponse = {
                id: Date.now() + 1,
                type: 'bot',
                text: generateResponse(question),
                timestamp: new Date()
              };
              setMessages(prev => [...prev, botResponse]);
              setIsTyping(false);
            }, 1000);
          }}
          className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
        >
          {isChinese ? '查詢積分' : 'Check Points'}
        </button>
        <button
          onClick={() => {
            const question = isChinese ? '有什麼獎品可以兌換？' : 'What prizes can I redeem?';
            const userMessage = {
              id: Date.now(),
              type: 'user',
              text: question,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, userMessage]);
            setIsTyping(true);
            setTimeout(() => {
              const botResponse = {
                id: Date.now() + 1,
                type: 'bot',
                text: generateResponse(question),
                timestamp: new Date()
              };
              setMessages(prev => [...prev, botResponse]);
              setIsTyping(false);
            }, 1000);
          }}
          className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
        >
          {isChinese ? '查看獎品' : 'View Prizes'}
        </button>
        <button
          onClick={() => {
            const question = isChinese ? '分店地址在哪裡？' : 'Where are your branches?';
            const userMessage = {
              id: Date.now(),
              type: 'user',
              text: question,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, userMessage]);
            setIsTyping(true);
            setTimeout(() => {
              const botResponse = {
                id: Date.now() + 1,
                type: 'bot',
                text: generateResponse(question),
                timestamp: new Date()
              };
              setMessages(prev => [...prev, botResponse]);
              setIsTyping(false);
            }, 1000);
          }}
          className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
        >
          {isChinese ? '分店位置' : 'Locations'}
        </button>
      </div>
    </div>
  );
};

export default AIChatbot;