import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDemoAuth } from './DemoAuthenticator';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';

const Layout = ({ children }) => {
  const { user, isAdmin, isSales, signOut, userType } = useDemoAuth();
  const { t } = useLanguage();
  const location = useLocation();

  // Bottom navigation tabs - ONLY for members (regular users)
  const bottomTabs = [
    { name: t('home'), href: '/', icon: '🏠' },
    { name: t('records'), href: '/records', icon: '📊' },
    { name: t('profile'), href: '/profile', icon: '👤' }
  ];

  // Admin/Sales users don't have bottom navigation - they only see admin interface
  const showBottomTabs = !isAdmin && !isSales;

  return (
    <div className={`min-h-screen bg-gray-50 ${showBottomTabs ? 'pb-16' : ''}`}>
      {/* Top Header - Exactly like original */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-2xl">🎯</span>
                <span className="text-xl font-bold text-gray-900">ClawPoints 爪爪積分</span>
              </Link>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Language Toggle */}
              <LanguageToggle />

              {/* Welcome Message - Responsive */}
              <span className="text-xs sm:text-sm text-gray-600 truncate max-w-32 sm:max-w-none">
                <span className="hidden sm:inline">{t('welcome')}, </span>
                <span className="sm:hidden">{t('welcome')},</span>
                <br className="sm:hidden" />
                <span>{user.attributes.name}</span>
              </span>

              {/* Sign Out */}
              <button
                onClick={signOut}
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 whitespace-nowrap"
              >
                {t('signOut')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Full width like original */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>

      {/* Bottom Navigation - ONLY for Members (not Admin/Sales) */}
      {showBottomTabs && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-inset-bottom">
          <div className="grid grid-cols-3">
            {bottomTabs.map((tab) => (
              <Link
                key={tab.name}
                to={tab.href}
                className={`flex flex-col items-center justify-center py-2 px-2 text-xs font-medium min-h-16 ${
                  location.pathname === tab.href
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl mb-1">{tab.icon}</span>
                <span className="truncate max-w-full text-center leading-tight">{tab.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;