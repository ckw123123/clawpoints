import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useAuth } from '../contexts/AuthContext-public';
import { useLanguage } from '../contexts/LanguageContext';
import { useSettings } from '../contexts/SettingsContext-demo';
import { useSharedData } from '../contexts/SharedDataContext-public';
// Demo version - AWS API removed

const Home = () => {
  const { user: userProfile } = useAuth();
  const { t } = useLanguage();
  const { settings } = useSettings();
  const { prizes } = useSharedData();
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [userPoints, setUserPoints] = useState(0);
  const [currentBranch, setCurrentBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);

  useEffect(() => {
    const generateQRCode = async () => {
      if (userProfile?.id) {
        try {
          const qrData = JSON.stringify({
            userId: userProfile.id,
            username: userProfile.username,
            timestamp: Date.now()
          });
          const url = await QRCode.toDataURL(qrData);
          setQrCodeUrl(url);
        } catch (error) {
          console.error('Error generating QR code:', error);
        }
      }
    };

    const fetchUserData = async () => {
      if (userProfile?.id) {
        try {
          // Demo version - use mock data
          setUserPoints(userProfile.points || 1250);
          // Get selected branch from settings
          const selectedBranchId = userProfile.selectedBranch || settings.branches?.[0]?.id;
          const selectedBranch = settings.branches?.find(b => b.id === selectedBranchId) || settings.branches?.[0];
          setCurrentBranch(selectedBranch);
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    generateQRCode();
    fetchUserData();
  }, [userProfile]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Points Summary */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">{t('yourPoints')}</h2>
        <p className="text-4xl font-bold">{userPoints.toLocaleString()}</p>
        <p className="text-primary-100 mt-2">{t('keepEarning')}</p>
      </div>

      {/* QR Code */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 text-center">{t('memberQRCode')}</h3>
        <div className="flex justify-center">
          {qrCodeUrl ? (
            <img 
              src={qrCodeUrl} 
              alt="Member QR Code" 
              className="w-48 h-48 border-2 border-gray-200 rounded-lg"
            />
          ) : (
            <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Generating QR Code...</span>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-600 text-center mt-4">
          {t('showQRCode')}
        </p>
      </div>

      {/* Branch Info */}
      {currentBranch && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-3">{t('currentBranch')}</h3>
          <div className="space-y-2">
            <p className="font-medium">{currentBranch.name}</p>
            <p className="text-gray-600">{currentBranch.location}</p>
            <div className="flex space-x-4 text-sm mt-3">
              <a
                href={`https://wa.me/${currentBranch.whatsapp?.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800"
              >
                💬 {currentBranch.whatsapp}
              </a>
              <a
                href={`tel:${currentBranch.phone}`}
                className="text-blue-600 hover:text-blue-800"
              >
                📞 {currentBranch.phone}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setShowRewardsModal(true)}
          className="bg-white rounded-lg p-4 shadow-sm text-center hover:bg-gray-50 transition-colors"
        >
          <div className="text-2xl mb-2">🎁</div>
          <h4 className="font-medium">{t('rewards')}</h4>
          <p className="text-sm text-gray-600">{t('browseRewards')}</p>
        </button>
        <button
          onClick={() => setShowScanModal(true)}
          className="bg-white rounded-lg p-4 shadow-sm text-center hover:bg-gray-50 transition-colors"
        >
          <div className="text-2xl mb-2">📱</div>
          <h4 className="font-medium">{t('scan')}</h4>
          <p className="text-sm text-gray-600">{t('scanItems')}</p>
        </button>
      </div>

      {/* Rewards Modal */}
      {showRewardsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">{t('availableRewards')}</h3>
              <button
                onClick={() => setShowRewardsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-96">
              <div className="space-y-3">
                {prizes.map((prize) => (
                  <div key={prize.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{prize.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{prize.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-semibold text-primary-600">
                            {prize.cost_points} {t('points')}
                          </span>
                          <span className="text-sm text-gray-500">
                            {t('stock')}: {prize.stock}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (userPoints >= prize.cost_points && prize.stock > 0) {
                          alert(`${t('redeemSuccess')} ${prize.name}! (${t('demo')} mode)`);
                        } else if (userPoints < prize.cost_points) {
                          alert(`${t('insufficientPoints')} ${t('need')} ${prize.cost_points} ${t('points')}`);
                        } else {
                          alert(`${t('outOfStock')}`);
                        }
                      }}
                      disabled={userPoints < prize.cost_points || prize.stock === 0}
                      className={`w-full mt-3 px-4 py-2 rounded-lg text-sm font-medium ${
                        userPoints >= prize.cost_points && prize.stock > 0
                          ? 'bg-primary-600 text-white hover:bg-primary-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {userPoints >= prize.cost_points && prize.stock > 0
                        ? t('redeem')
                        : userPoints < prize.cost_points
                        ? t('insufficientPoints')
                        : t('outOfStock')
                      }
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scan Modal */}
      {showScanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">{t('scanToEarn')}</h3>
              <button
                onClick={() => setShowScanModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 text-center">
              <div className="text-6xl mb-4">📱</div>
              <h4 className="text-lg font-medium mb-2">{t('scanInstructions')}</h4>
              <p className="text-gray-600 mb-6">{t('scanDescription')}</p>
              
              {/* Demo Scan Button */}
              <button
                onClick={() => {
                  const demoPoints = Math.floor(Math.random() * 30) + 10; // 10-40 points
                  alert(`${t('scanSuccess')} +${demoPoints} ${t('points')}! (${t('demo')} mode)`);
                  setShowScanModal(false);
                }}
                className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
              >
                {t('simulateScan')} ({t('demo')})
              </button>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{t('scanTip')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;