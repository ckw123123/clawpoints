import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext-public';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';

const Layout = ({ children }) => {
  const { userProfile, isAdmin, isSales, signOut } = useAuth();
  const { t, language, changeLanguage } = useLanguage();
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
      { name: t('records'), href: '/records', icon: '📊' },
      { name: t('profile'), href: '/profile', icon: '👤' }
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                {t('appName')}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageToggle size="small" />
              <span className="text-sm text-gray-700">
                {t('welcome')}, {userProfile?.name || userProfile?.username}
              </span>
              <button
                onClick={signOut}
                className="text-sm text-red-600 hover:text-red-800"
              >
                {t('signOut')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around py-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center py-2 px-3 rounded-lg ${
                  location.pathname === item.href
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="text-xl mb-1">{item.icon}</span>
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Bottom padding to account for fixed navigation */}
      <div className="h-20"></div>
    </div>
  );
};

export default Layout;