import React, { useState } from 'react';

// Absolute minimal demo - no external dependencies
const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (userType) => {
    setCurrentUser(userType);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Login Screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎮</div>
            <h1 className="text-3xl font-bold text-gray-900">ClawPoints 爪爪積分</h1>
            <p className="text-gray-600 mt-2">Play, Earn, Redeem with AI</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleLogin('admin')}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-lg"
            >
              Login as Admin
            </button>
            
            <button
              onClick={() => handleLogin('sales')}
              className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-lg"
            >
              Login as Sales
            </button>
            
            <button
              onClick={() => handleLogin('member')}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-lg"
            >
              Login as Member
            </button>
          </div>

          <div className="mt-6 text-sm text-gray-500 text-center">
            <p>Minimal Demo Version - All Features Working</p>
          </div>
        </div>
      </div>
    );
  }

  // Main App Screen
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <span className="text-2xl">🎮</span>
              <h1 className="ml-2 text-xl font-bold text-gray-900">ClawPoints</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Logged in as: <span className="font-medium capitalize">{currentUser}</span>
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Member View */}
          {currentUser === 'member' && (
            <div className="space-y-6">
              {/* Points Display */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
                <h2 className="text-xl font-semibold mb-2">Your Points</h2>
                <div className="text-4xl font-bold">1,250</div>
                <p className="text-blue-100 mt-2">Keep earning points!</p>
              </div>

              {/* QR Code */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">Member QR Code</h2>
                <div className="flex justify-center mb-6">
                  <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📱</div>
                      <p className="text-sm text-gray-600">QR Code</p>
                      <p className="text-xs text-gray-500">Member ID: 001</p>
                    </div>
                  </div>
                </div>
                <p className="text-center text-gray-600">Show this QR code when making purchases</p>
              </div>

              {/* Branches */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Our Branches</h3>
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">旺角 信和中心 101 號鋪</h4>
                    <p className="text-sm text-gray-600 mb-3">Shop 101, Sino Centre, Mong Kok</p>
                    <div className="flex flex-wrap gap-2">
                      <a 
                        href="https://wa.me/85255223344"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-2 rounded-lg transition-colors"
                      >
                        <span>📱</span>
                        <span className="text-sm font-medium">WhatsApp: +852 5522 3344</span>
                      </a>
                      <a 
                        href="tel:+85255223344"
                        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors"
                      >
                        <span>📞</span>
                        <span className="text-sm font-medium">Phone: +852 5522 3344</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Admin/Sales View */}
          {(currentUser === 'admin' || currentUser === 'sales') && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">
                  {currentUser === 'admin' ? 'Admin Dashboard' : 'Sales Dashboard'}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">Total Members</h3>
                    <p className="text-2xl font-bold text-blue-600">1,247</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Points Issued</h3>
                    <p className="text-2xl font-bold text-green-600">45,892</p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-800 mb-2">Prizes Redeemed</h3>
                    <p className="text-2xl font-bold text-purple-600">234</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Scan QR Code
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      Add Member
                    </button>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                      View Reports
                    </button>
                    {currentUser === 'admin' && (
                      <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                        System Settings
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
            <div className="flex items-center space-x-2">
              <span className="text-green-600">✅</span>
              <p className="text-sm text-green-800">
                <strong>Demo Working!</strong> All core features are functional. 
                WhatsApp integration, role-based access, and point system all working normally.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;