import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDemoAuth } from './DemoAuthenticator';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';

const Layout = ({ children }) => {
  const { user, isAdmin, isSales, signOut, userType } = useDemoAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const navigation = [];

  if (isAdmin || isSales) {
    // Staff navigation (Admin & Sales) - Admin dropdown with sections
    navigation.push(
      { 
        name: t('admin'), 
        href: '/admin', 
        icon: '⚙️',
        isDropdown: true,
        sections: [
          { name: t('scanner'), href: '/admin?tab=scan', icon: '📱' },
          { name: t('members'), href: '/admin?tab=members', icon: '👥' },
          { name: t('prizes'), href: '/admin?tab=prizes', icon: '🎁' },
          { name: t('items'), href: '/admin?tab=items', icon: '📦' },
          ...(isAdmin ? [
            { name: t('users'), href: '/admin?tab=users', icon: '👤' },
            { name: t('branches'), href: '/admin?tab=branches', icon: '🏪' },
            { name: t('settings'), href: '/admin?tab=settings', icon: '⚙️' }
          ] : [])
        ]
      }
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
    <div className="min-h-screen bg-gray-50 pb-16 sm:pb-0">
      {/* Top Header */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-2xl">🎯</span>
                <span className="text-xl font-bold text-gray-900 hidden sm:block">{t('appName')}</span>
                <span className="text-lg font-bold text-gray-900 sm:hidden">Demo</span>
              </Link>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* User Info - Responsive */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                  {t('welcome')}, {user.attributes.name}
                </span>
                <span className="text-xs sm:text-sm text-gray-600 sm:hidden">
                  {user.attributes.name}
                </span>
                {userType === 'admin' && (
                  <span className="px-1 sm:px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                    {t('admin')}
                  </span>
                )}
                {userType === 'sales' && (
                  <span className="px-1 sm:px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {t('sales')}
                  </span>
                )}
                {userType === 'user' && (
                  <span className="px-1 sm:px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    {t('member')}
                  </span>
                )}
              </div>

              {/* Language Toggle */}
              <LanguageToggle size="small" />

              {/* Sign Out */}
              <button
                onClick={signOut}
                className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 px-2 py-1 rounded"
              >
                <span className="hidden sm:inline">{t('signOut')}</span>
                <span className="sm:hidden">🚪</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto focus:outline-none">
        <div className="py-4 sm:py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 sm:hidden z-50">
        <div className="grid grid-cols-3 sm:grid-cols-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center justify-center py-2 px-1 text-xs font-medium ${
                location.pathname === item.href
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span className="truncate">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop Sidebar (Hidden on Mobile) */}
      <div className="hidden sm:fixed sm:inset-y-0 sm:left-0 sm:flex sm:w-64 sm:flex-col">
        <div className="flex flex-col flex-grow pt-20 pb-4 overflow-y-auto bg-white border-r">
          <nav className="mt-5 flex-1 px-4 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.isDropdown ? (
                  <div className="space-y-1">
                    {/* Dropdown Header */}
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className={`group flex items-center justify-between w-full px-2 py-2 text-sm font-medium rounded-md ${
                        location.pathname.includes('/admin')
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-3 text-lg">{item.icon}</span>
                        {item.name}
                      </div>
                      <span className={`transform transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </button>
                    
                    {/* Dropdown Items */}
                    {dropdownOpen && (
                      <div className="ml-6 space-y-1">
                        {item.sections.map((section) => (
                          <Link
                            key={section.name}
                            to={section.href}
                            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                              location.search.includes(section.href.split('=')[1])
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                            }`}
                          >
                            <span className="mr-3 text-base">{section.icon}</span>
                            {section.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
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
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop Content Offset */}
      <div className="hidden sm:block sm:pl-64">
        {/* This div provides the left padding for desktop sidebar */}
      </div>

      {/* Demo Mode Indicator */}
      <div className="fixed bottom-20 right-4 sm:bottom-4 sm:right-4 z-40">
        <div className="bg-yellow-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-medium shadow-lg">
          <span className="hidden sm:inline">{t('demoMode')}</span>
          <span className="sm:hidden">Demo</span>
        </div>
      </div>
    </div>
  );
};

export default Layout;