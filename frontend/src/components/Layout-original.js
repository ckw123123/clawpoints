import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDemoAuth } from './DemoAuthenticator';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';

const Layout = ({ children }) => {
  const { user, isAdmin, isSales, signOut, userType } = useDemoAuth();
  const { t } = useLanguage();
  const location = useLocation();

  const navigation = [];

  if (isAdmin || isSales) {
    // Staff navigation (Admin & Sales) - Only Admin tab
    navigation.push(
      { name: t('admin'), href: '/admin', icon: '⚙️' }
    );
  } else {
    // Member navigation (regular users)
    navigation.push(
      { name: t('home'), href: '/', icon: '🏠' },
      { name: t('records'), href: '/records', icon: '📋' },
      { name: t('profile'), href: '/profile', icon: '👤' }
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-2xl">🎯</span>
                <span className="text-xl font-bold text-gray-900">{t('appName')}</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {/* User Info */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {t('welcome')}, {user.attributes.name}
                </span>
                {userType === 'admin' && (
                  <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                    {t('admin')}
                  </span>
                )}
                {userType === 'sales' && (
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {t('sales')}
                  </span>
                )}
                {userType === 'user' && (
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    {t('member')}
                  </span>
                )}
              </div>

              {/* Language Toggle */}
              <LanguageToggle />

              {/* Sign Out */}
              <button
                onClick={signOut}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {t('signOut')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="sm:hidden bg-white border-b">
        <div className="px-4 py-2">
          <div className="flex space-x-1 overflow-x-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  location.pathname === item.href
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden sm:flex sm:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white border-r">
              <nav className="mt-5 flex-1 px-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      location.pathname === item.href
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Demo Mode Indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
          {t('demoMode')}
        </div>
      </div>
    </div>
  );
};

export default Layout;