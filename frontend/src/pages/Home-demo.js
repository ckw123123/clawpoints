import React from 'react';
import { useDemoAuth } from '../components/DemoAuthenticator';
import { useLanguage } from '../contexts/LanguageContext';
import { useSharedData } from '../contexts/SharedDataContext-demo';

const Home = () => {
  const { user, userType, isAdmin, isSales } = useDemoAuth();
  const { t } = useLanguage();
  const { members } = useSharedData();

  // Find current user's member data if they're a regular member
  const memberData = userType === 'user' ? members.find(m => m.username === 'john_doe') : null;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {t('welcome')}, {user.attributes.name}!
        </h1>
        <p className="text-gray-600">
          {isAdmin && t('adminWelcomeMessage')}
          {isSales && !isAdmin && t('salesWelcomeMessage')}
          {!isSales && !isAdmin && t('memberWelcomeMessage')}
        </p>
      </div>

      {/* Member Points Display */}
      {memberData && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow p-6 text-white">
          <h2 className="text-xl font-semibold mb-2">{t('yourPoints')}</h2>
          <div className="text-3xl font-bold">{memberData.points.toLocaleString()}</div>
          <p className="text-blue-100 mt-2">{t('pointsDescription')}</p>
        </div>
      )}

      {/* Member QR Code Display */}
      {memberData && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('memberQRCode')}</h2>
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* QR Code */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">📱</div>
                  <div className="text-xs text-gray-500">QR Code</div>
                  <div className="text-xs text-gray-500">#{memberData.id}</div>
                </div>
              </div>
            </div>
            
            {/* Instructions */}
            <div className="flex-1">
              <p className="text-gray-600 mb-3">{t('showQRCode')}</p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-medium text-blue-900 mb-2">How to use:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Show this QR code to staff when making purchases</li>
                  <li>• Staff will scan to add points to your account</li>
                  <li>• Use for redeeming prizes and rewards</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin/Sales Dashboard Preview */}
      {(isAdmin || isSales) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('totalMembers')}</h3>
            <div className="text-2xl font-bold text-blue-600">{members.length}</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('totalPoints')}</h3>
            <div className="text-2xl font-bold text-green-600">
              {members.reduce((sum, member) => sum + member.points, 0).toLocaleString()}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('activeMembers')}</h3>
            <div className="text-2xl font-bold text-purple-600">{members.length}</div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('quickActions')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {!isAdmin && !isSales && (
            <>
              <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 text-left">
                <div className="font-medium text-blue-900">{t('viewTransactions')}</div>
                <div className="text-sm text-blue-600">{t('checkYourHistory')}</div>
              </button>
              <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 text-left">
                <div className="font-medium text-green-900">{t('updateProfile')}</div>
                <div className="text-sm text-green-600">{t('manageYourInfo')}</div>
              </button>
            </>
          )}
          
          {(isAdmin || isSales) && (
            <>
              <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 text-left">
                <div className="font-medium text-purple-900">{t('scanBarcode')}</div>
                <div className="text-sm text-purple-600">{t('processTransaction')}</div>
              </button>
              <button className="p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 text-left">
                <div className="font-medium text-indigo-900">{t('manageMembers')}</div>
                <div className="text-sm text-indigo-600">{t('addEditMembers')}</div>
              </button>
              <button className="p-4 bg-pink-50 rounded-lg hover:bg-pink-100 text-left">
                <div className="font-medium text-pink-900">{t('managePrizes')}</div>
                <div className="text-sm text-pink-600">{t('updateRewards')}</div>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Demo Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">{t('demoMode')}</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>{t('demoModeDescription')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;