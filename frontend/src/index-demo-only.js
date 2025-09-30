import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Ultra-simple demo - completely isolated
function DemoApp() {
  const [userType, setUserType] = React.useState(null);

  if (!userType) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">🎯 Loyalty Points Demo</h1>
            <p className="text-gray-600 mt-2">Choose your demo role</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setUserType('user')}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              🔵 Demo User (Member)
            </button>
            
            <button
              onClick={() => setUserType('sales')}
              className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
            >
              🟣 Demo Sales Staff
            </button>
            
            <button
              onClick={() => setUserType('admin')}
              className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              🟢 Demo Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-900">🎯 Loyalty Points Demo</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, Demo {userType === 'admin' ? 'Admin' : userType === 'sales' ? 'Sales' : 'User'}!
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                userType === 'admin' ? 'bg-red-100 text-red-800' :
                userType === 'sales' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {userType === 'admin' ? 'Admin' : userType === 'sales' ? 'Sales' : 'Member'}
              </span>
              <button
                onClick={() => setUserType(null)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to the Demo!
            </h1>
            <p className="text-gray-600">
              {userType === 'admin' && '🟢 You have full admin access to all features.'}
              {userType === 'sales' && '🟣 You can manage members, prizes, and items.'}
              {userType === 'user' && '🔵 You can view your points and transaction history.'}
            </p>
          </div>

          {/* Role-specific content */}
          {userType === 'user' && (
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow p-6 text-white">
              <h2 className="text-xl font-semibold mb-2">Your Points</h2>
              <div className="text-3xl font-bold">1,250</div>
              <p className="text-blue-100 mt-2">Keep earning points with every purchase!</p>
            </div>
          )}

          {(userType === 'admin' || userType === 'sales') && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Members</h3>
                <div className="text-2xl font-bold text-blue-600">10</div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Points</h3>
                <div className="text-2xl font-bold text-green-600">12,500</div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Members</h3>
                <div className="text-2xl font-bold text-purple-600">10</div>
              </div>
            </div>
          )}

          {/* Feature Lists */}
          {userType === 'admin' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-800">🟢 Admin Features Available</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>✅ User Management - Add/edit/delete sales staff</p>
                <p>✅ Member Management - Full member control</p>
                <p>✅ Prize & Item Management - Complete inventory control</p>
                <p>✅ Branch Management - Store location management</p>
                <p>✅ System Settings - Configure system parameters</p>
              </div>
            </div>
          )}

          {userType === 'sales' && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-purple-800">🟣 Sales Features Available</h3>
              <div className="mt-2 text-sm text-purple-700">
                <p>✅ Member Management - Add/edit/delete members</p>
                <p>✅ Prize Management - Manage reward items</p>
                <p>✅ Item Management - Manage point-earning items</p>
                <p>✅ Barcode Scanning - Process transactions</p>
                <p>❌ User Management - Admin only</p>
              </div>
            </div>
          )}

          {userType === 'user' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800">🔵 Member Features Available</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>✅ View Points Balance - Current: 1,250 points</p>
                <p>✅ Transaction History - See all point activities</p>
                <p>✅ Profile Management - Update personal information</p>
                <p>✅ Redeem Rewards - Use points for prizes</p>
              </div>
            </div>
          )}

          {/* Demo Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-yellow-400 text-xl">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Demo Mode Active</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>This is a working demo with role-based access control. All data is simulated and stored locally.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <DemoApp />
  </React.StrictMode>
);