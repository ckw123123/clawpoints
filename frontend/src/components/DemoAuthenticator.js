import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';

// Login form component that uses language context
const LoginForm = ({ onLogin }) => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{t('appName')}</h1>
          <p className="text-gray-600 mt-2">{t('appSlogan')}</p>
          <div className="mt-2 text-xs text-gray-500">{t('demoPreview')}</div>
        </div>

        {/* Language Toggle */}
        <div className="flex justify-center mb-6">
          <LanguageToggle />
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onLogin('user')}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            {t('loginAsMember')}
          </button>
          
          <div className="text-center text-sm text-gray-500 my-2">
            {t('orLoginWithCredentials')}
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">{t('memberLoginExample')}:</p>
            <p className="text-xs text-gray-500">Username: john_doe</p>
            <p className="text-xs text-gray-500">Password: demo123</p>
          </div>
          
          <button
            onClick={() => onLogin('sales')}
            className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
          >
            {t('loginAsSales')}
          </button>
          
          <button
            onClick={() => onLogin('admin')}
            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            {t('loginAsAdmin')}
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-500 text-center">
          <p>{t('demoNotice')}</p>
        </div>
      </div>
    </div>
  );
};

// Demo Auth Context
const DemoAuthContext = React.createContext();

export const useDemoAuth = () => {
  const context = React.useContext(DemoAuthContext);
  if (!context) {
    throw new Error('useDemoAuth must be used within DemoAuthenticator');
  }
  return context;
};

// Demo authenticator for preview purposes
const DemoAuthenticator = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState('user');

  const demoUser = {
    userId: 'demo-user-123',
    username: 'demouser',
    attributes: {
      name: 'Demo User',
      email: 'demo@example.com'
    }
  };

  const demoSales = {
    userId: 'demo-sales-123',
    username: 'demosales',
    attributes: {
      name: 'Demo Sales',
      email: 'sales@example.com'
    }
  };

  const demoAdmin = {
    userId: 'demo-admin-123',
    username: 'demoadmin',
    attributes: {
      name: 'Demo Admin',
      email: 'admin@example.com'
    }
  };

  const signOut = () => {
    setIsAuthenticated(false);
  };

  const handleLogin = (type) => {
    setUserType(type);
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <LanguageProvider>
        <LoginForm onLogin={handleLogin} />
      </LanguageProvider>
    );
  }

  const user = userType === 'admin' ? demoAdmin : userType === 'sales' ? demoSales : demoUser;
  
  const authValue = {
    user,
    signOut,
    isAuthenticated: true,
    userType,
    isAdmin: userType === 'admin',
    isSales: userType === 'sales' || userType === 'admin',
    userRole: userType === 'admin' ? 'admin' : userType === 'sales' ? 'sales' : 'member'
  };
  
  return (
    <DemoAuthContext.Provider value={authValue}>
      {children}
    </DemoAuthContext.Provider>
  );
};

export default DemoAuthenticator;