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
          <div className="text-6xl mb-4">🎮</div>
          <h1 className="text-3xl font-bold text-gray-900">ClawPoints 爪爪積分</h1>
          <p className="text-gray-600 mt-2">Play, Earn, Redeem with AI</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onLogin('admin')}
            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-lg"
          >
            Login as Admin
          </button>
          
          <button
            onClick={() => onLogin('sales')}
            className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-lg"
          >
            Login as Sales
          </button>
          
          <button
            onClick={() => onLogin('user')}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-lg"
          >
            Login as Member
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-500 text-center">
          <p>Demo Version - Choose your role to explore</p>
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

// Demo authenticator component
const DemoAuthenticatorInner = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState('user');
  const { t } = useLanguage();

  const demoUser = {
    userId: 'demo-user-123',
    username: 'demouser',
    attributes: {
      name: t('demoUser'),
      email: 'demo@example.com'
    }
  };

  const demoSales = {
    userId: 'demo-sales-123',
    username: 'demosales',
    attributes: {
      name: t('demoSales'),
      email: 'sales@example.com'
    }
  };

  const demoAdmin = {
    userId: 'demo-admin-123',
    username: 'demoadmin',
    attributes: {
      name: t('demoAdmin'),
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
    return <LoginForm onLogin={handleLogin} />;
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

// Wrapper component that provides language context
const DemoAuthenticator = ({ children }) => {
  return (
    <LanguageProvider>
      <DemoAuthenticatorInner>
        {children}
      </DemoAuthenticatorInner>
    </LanguageProvider>
  );
};

export default DemoAuthenticator;