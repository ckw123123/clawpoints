import React, { useState } from 'react';
import { API } from 'aws-amplify';

const ChatbotTest = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const testMessages = [
    '我有幾多積分？',
    'How many points do I have?',
    '有咩獎品可以換？',
    'What can I redeem?',
    '積分幾時過期？',
    'When do points expire?'
  ];

  const sendTestMessage = async (testMsg = null) => {
    const msgToSend = testMsg || message;
    if (!msgToSend.trim()) return;

    setLoading(true);
    try {
      const result = await API.post('membershipAPI', '/lex/webhook', {
        body: {
          message: msgToSend,
          userId: 'test-user-id'
        }
      });
      setResponse(result.message);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Chatbot Test</h3>
      
      {/* Quick Test Buttons */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Quick Tests:</p>
        <div className="grid grid-cols-1 gap-2">
          {testMessages.map((msg, index) => (
            <button
              key={index}
              onClick={() => sendTestMessage(msg)}
              className="text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              disabled={loading}
            >
              {msg}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Message Input */}
      <div className="mb-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          onKeyPress={(e) => e.key === 'Enter' && sendTestMessage()}
        />
        <button
          onClick={() => sendTestMessage()}
          disabled={loading || !message.trim()}
          className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </div>

      {/* Response */}
      {response && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700">Response:</p>
          <p className="text-sm text-gray-900 whitespace-pre-wrap">{response}</p>
        </div>
      )}
    </div>
  );
};

export default ChatbotTest;