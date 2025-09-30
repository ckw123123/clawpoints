import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext-public';
import { useLanguage } from '../contexts/LanguageContext';
import { useSettings } from '../contexts/SettingsContext-demo';
import { useSharedData } from '../contexts/SharedDataContext-public';

const AdminDashboard = () => {
  const { isAdmin, isSales, userRole, canManageUsers, canManageMembers } = useAuth();
  const { t } = useLanguage();
  const { settings, updateSettings } = useSettings();
  const {
    members: allMembers,
    prizes,
    items,
    branches: sharedBranches,
    transactions,
    loading: dataLoading,
    error: dataError,
    addMember,
    updateMember,
    deleteMember,
    searchMembers,
    addPrize,
    updatePrize,
    deletePrize,
    addItem,
    updateItem,
    deleteItem,
    addBranch,
    updateBranch,
    deleteBranch,
    processPointTransaction,
    getMemberTransactions,
    recognizeBarcode,
    APINotice
  } = useSharedData();

  // Component state
  const [activeTab, setActiveTab] = useState('scan');
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanType, setScanType] = useState('prize');

  // Search and pagination states
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [prizeSearchQuery, setPrizeSearchQuery] = useState('');
  const [itemSearchQuery, setItemSearchQuery] = useState('');
  const [memberCurrentPage, setMemberCurrentPage] = useState(1);
  const [prizeCurrentPage, setPrizeCurrentPage] = useState(1);
  const [itemCurrentPage, setItemCurrentPage] = useState(1);
  const [showAllMembers, setShowAllMembers] = useState(false);

  // Search results
  const [members, setMembers] = useState([]);

  // Initialize branches
  useEffect(() => {
    const availableBranches = sharedBranches.length > 0 ? sharedBranches : 
      (settings.branches || [{ id: '1', name: 'Main Branch', location: 'Downtown' }]);
    
    setBranches(availableBranches);
    if (!selectedBranch && availableBranches.length > 0) {
      setSelectedBranch(availableBranches[0].id);
    }
  }, [sharedBranches, settings.branches, selectedBranch]);

  // Search members when query changes
  useEffect(() => {
    const performSearch = async () => {
      if (memberSearchQuery.trim()) {
        try {
          const results = await searchMembers(memberSearchQuery);
          setMembers(results);
        } catch (error) {
          console.error('Search error:', error);
          setMembers([]);
        }
      } else {
        setMembers([]);
      }
    };

    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [memberSearchQuery, searchMembers]);

  // Handle point transaction
  const handlePointTransaction = async (userId, points, type, itemName) => {
    setLoading(true);
    try {
      const transaction = await processPointTransaction(
        userId, 
        points, 
        type === 'add' ? 'earn' : 'redeem', 
        itemName, 
        selectedBranch
      );
      
      const updatedMember = allMembers.find(m => m.id === userId);
      
      alert(`${t('successfully')} ${type === 'add' ? t('earned') : t('redeemed')} ${Math.abs(points)} ${t('points')}!\n${updatedMember?.name} ${t('nowHas')} ${updatedMember?.points} ${t('points')}.`);
      setScanResult(null);
    } catch (error) {
      console.error('Error processing transaction:', error);
      alert(t('errorProcessingTransaction'));
    } finally {
      setLoading(false);
    }
  };

  // Redirect regular users to home page
  if (!isAdmin && !isSales) {
    return <Navigate to="/" replace />;
  }

  // Show loading state
  if (dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('loading')}...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (dataError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('error')}</h2>
          <p className="text-gray-600 mb-4">{dataError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t('retry')}
          </button>
        </div>
      </div>
    );
  }

  // Build tabs based on user permissions
  const tabs = [
    { id: 'scan', name: t('redemption'), icon: '💳' },
    { id: 'members', name: t('members'), icon: '👥' },
    { id: 'prizes', name: t('prizes'), icon: '🎁' },
    { id: 'items', name: t('items'), icon: '📦' },
  ];

  // Only Admin can manage users and branches
  if (canManageUsers) {
    tabs.push({ id: 'users', name: t('users'), icon: '👤' });
    tabs.push({ id: 'branches', name: t('branches'), icon: '🏪' });
  }

  // My Account tab for all staff
  tabs.push({ id: 'account', name: t('myAccount'), icon: '👤' });

  // Only Admin can access settings
  if (isAdmin) {
    tabs.push({ id: 'settings', name: t('settings'), icon: '⚙️' });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{t('adminDashboard')}</h2>
          <div className="flex items-center space-x-2 text-sm">
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded">🌐 Public Demo</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">Production UI</span>
          </div>
        </div>
        
        {/* Branch Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('currentBranch')}
          </label>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name} - {branch.location}
              </option>
            ))}
          </select>
        </div>

        {/* Tab Navigation - Desktop */}
        <div className="hidden md:flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Tab Navigation - Mobile Dropdown */}
        <div className="md:hidden">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.icon} {tab.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Scanner Tab */}
      {activeTab === 'scan' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">{t('qrScanner')}</h3>
            
            {/* API Notice */}
            <APINotice 
              feature="Real-time Barcode Scanning" 
              cost="Free (Camera API)" 
            />
            
            {/* Business Flow Steps */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">📋 {t('businessFlowSteps')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">1</span>
                  <span>{t('memberShowsQR')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">2</span>
                  <span>{t('staffScansPrize')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">3</span>
                  <span>{t('staffScansMember')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">4</span>
                  <span>{t('systemUpdates')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">5</span>
                  <span>{t('adminCanCheck')}</span>
                </div>
              </div>
            </div>

            {/* Current Step Indicator */}
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-600">📍</span>
                <span className="font-medium text-yellow-800">
                  {!scanResult ? t('step1ScanPrize') : 
                   scanResult.type === 'prize' ? t('step2ScanMember') :
                   t('step3Complete')}
                </span>
              </div>
            </div>

            {/* Scan Button */}
            <div className="text-center mb-4">
              <button
                onClick={() => {
                  if (!scanResult) {
                    // Step 1: Intelligent barcode scan - randomly pick item or prize
                    const allBarcodes = [...items.map(i => i.barcode), ...prizes.map(p => p.barcode)];
                    const randomBarcode = allBarcodes[Math.floor(Math.random() * allBarcodes.length)];
                    const recognition = recognizeBarcode(randomBarcode);
                    
                    if (recognition.type === 'prize') {
                      setScanResult({ 
                        type: 'prize',
                        barcode: recognition.data.barcode,
                        prizeId: recognition.data.id,
                        prizeName: recognition.data.name,
                        pointsReward: recognition.data.points_reward,
                        costPoints: recognition.data.cost_points,
                        recognizedAs: 'prize'
                      });
                    } else if (recognition.type === 'item') {
                      setScanResult({ 
                        type: 'item',
                        barcode: recognition.data.barcode,
                        itemId: recognition.data.id,
                        itemName: recognition.data.name,
                        pointsValue: recognition.data.points_value,
                        recognizedAs: 'item'
                      });
                    }
                    setScanType('user'); // Next step will be user scan
                  } else if ((scanResult.type === 'prize' || scanResult.type === 'item') && !scanResult.memberScanned) {
                    // Step 2: Scan member QR code
                    const randomMember = allMembers[Math.floor(Math.random() * allMembers.length)];
                    setScanResult(prev => ({ 
                      ...prev,
                      memberScanned: true,
                      userId: randomMember.id, 
                      username: randomMember.username,
                      name: randomMember.name,
                      points: randomMember.points
                    }));
                  }
                }}
                disabled={loading}
                className={`px-6 py-3 rounded-lg font-medium ${
                  !scanResult 
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? t('processing') : (!scanResult ? t('scanBarcode') : t('scanUserQR'))}
              </button>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">📷</div>
              <p className="text-gray-600 mb-4">
                {!scanResult 
                  ? `${t('step1Instruction')}`
                  : scanResult.type === 'prize' && !scanResult.memberScanned
                  ? `${t('step2Instruction')}`
                  : `${t('readyForTransaction')}`
                }
              </p>
              
              {/* Camera Status */}
              <div className="text-sm text-gray-500">
                {!scanResult 
                  ? t('cameraReadyForPrize')
                  : scanResult.type === 'prize' && !scanResult.memberScanned
                  ? t('cameraReadyForMember')
                  : t('scanningComplete')
                }
              </div>
            </div>

            {scanResult && (
              <div className="mt-4">
                {/* Step 1: Prize Scanned */}
                {scanResult.type === 'prize' && !scanResult.memberScanned && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-3">✅ {t('step1Complete')}</h4>
                    <div className="bg-white p-3 rounded border mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{scanResult.prizeName}</p>
                          <p className="text-sm text-gray-600">{t('barcode')}: {scanResult.barcode}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-blue-600">+{scanResult.pointsReward} {t('points')}</p>
                          <p className="text-sm text-gray-500">{t('redeem')} {t('need')}: {scanResult.costPoints} {t('points')}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
                      <p className="text-sm text-green-800">
                        <strong>✅ {t('systemRecognizedPrize')}</strong><br/>
                        {t('nowScanMemberQRToChooseAction')}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-2">👤</div>
                      <p className="text-gray-600 mb-3">{t('waitingForMemberQR')}</p>
                    </div>
                  </div>
                )}

                {/* Step 2: Prize and Member Scanned */}
                {scanResult.type === 'prize' && scanResult.memberScanned && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-3">✅ {t('step2Complete')}</h4>
                    
                    {/* Prize Info */}
                    <div className="bg-white p-3 rounded border mb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-blue-700">🎁 {scanResult.prizeName}</p>
                          <p className="text-sm text-gray-600">{t('reward')}: +{scanResult.pointsReward} {t('points')} | {t('redeem')}: -{scanResult.costPoints} {t('points')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Member Info */}
                    <div className="bg-white p-3 rounded border mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-green-700">👤 {scanResult.name}</p>
                          <p className="text-sm text-gray-600">@{scanResult.username}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-green-600">{scanResult.points} {t('points')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Selection */}
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-800">{t('selectAction')}:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <button
                          onClick={() => {
                            // Add points for prize collection
                            handlePointTransaction(scanResult.userId, scanResult.pointsReward, 'add', `${scanResult.prizeName} (${t('prizeCollection')})`);
                          }}
                          className="p-4 border-2 border-blue-300 rounded-lg hover:bg-blue-50 text-left"
                        >
                          <div className="font-medium text-blue-700">💰 {t('addPointsForPrize')}</div>
                          <div className="text-sm text-gray-600">{t('memberGotPrizeAddPoints')}</div>
                          <div className="text-lg font-semibold text-blue-600 mt-1">+{scanResult.pointsReward} {t('points')}</div>
                        </button>
                        <button
                          onClick={() => {
                            // Redeem prize
                            if (scanResult.points >= scanResult.costPoints) {
                              handlePointTransaction(scanResult.userId, scanResult.costPoints, 'redeem', `${scanResult.prizeName} (${t('prizeRedemption')})`);
                            } else {
                              alert(`${t('insufficientPoints')}! ${t('need')} ${scanResult.costPoints} ${t('points')}, ${t('currentBalance')}: ${scanResult.points} ${t('points')}`);
                            }
                          }}
                          disabled={scanResult.points < scanResult.costPoints}
                          className={`p-4 border-2 rounded-lg text-left ${
                            scanResult.points >= scanResult.costPoints
                              ? 'border-red-300 hover:bg-red-50'
                              : 'border-gray-300 bg-gray-100 cursor-not-allowed'
                          }`}
                        >
                          <div className={`font-medium ${scanResult.points >= scanResult.costPoints ? 'text-red-700' : 'text-gray-500'}`}>
                            🏆 {t('redeemThisPrize')}
                          </div>
                          <div className="text-sm text-gray-600">{t('memberWantsThisPrize')}</div>
                          <div className={`text-lg font-semibold mt-1 ${scanResult.points >= scanResult.costPoints ? 'text-red-600' : 'text-gray-400'}`}>
                            -{scanResult.costPoints} {t('points')}
                          </div>
                          {scanResult.points < scanResult.costPoints && (
                            <div className="text-xs text-red-500 mt-1">{t('insufficientPoints')}</div>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 1: Item Scanned */}
                {scanResult.type === 'item' && !scanResult.memberScanned && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-3">✅ {t('step1Complete')} - {t('itemRecognized')}</h4>
                    <div className="bg-white p-3 rounded border mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{scanResult.itemName}</p>
                          <p className="text-sm text-gray-600">{t('barcode')}: {scanResult.barcode}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-green-600">+{scanResult.pointsValue} {t('points')}</p>
                          <p className="text-sm text-gray-500">{t('earnPointsForPurchase')}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                      <p className="text-sm text-blue-800">
                        <strong>✅ {t('systemRecognizedAsItem')}</strong><br/>
                        {t('memberWillEarnPointsForPurchase')}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-2">👤</div>
                      <p className="text-gray-600 mb-3">{t('waitingForMemberQR')}</p>
                    </div>
                  </div>
                )}

                {/* Step 2: Item and Member Scanned */}
                {scanResult.type === 'item' && scanResult.memberScanned && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-3">✅ {t('step2Complete')} - {t('itemPurchase')}</h4>
                    
                    {/* Item Info */}
                    <div className="bg-white p-3 rounded border mb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-green-700">📦 {scanResult.itemName}</p>
                          <p className="text-sm text-gray-600">{t('reward')}: +{scanResult.pointsValue} {t('points')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Member Info */}
                    <div className="bg-white p-3 rounded border mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-green-700">👤 {scanResult.name}</p>
                          <p className="text-sm text-gray-600">@{scanResult.username}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-green-600">{scanResult.points} {t('points')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action - Only Add Points for Items */}
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-800">{t('confirmPurchase')}:</h5>
                      <button
                        onClick={() => {
                          // Add points for item purchase
                          handlePointTransaction(scanResult.userId, scanResult.pointsValue, 'add', `${scanResult.itemName} (${t('itemPurchase')})`);
                        }}
                        className="w-full p-4 border-2 border-green-300 rounded-lg hover:bg-green-50 text-left"
                      >
                        <div className="font-medium text-green-700">💰 {t('confirmItemPurchase')}</div>
                        <div className="text-sm text-gray-600">{t('memberPurchasedItem')}</div>
                        <div className="text-lg font-semibold text-green-600 mt-1">+{scanResult.pointsValue} {t('points')}</div>
                      </button>
                    </div>
                  </div>
                )}

                {scanResult.type === 'unknown' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">{t('itemNotFound')}</h4>
                    <p className="text-red-700 mb-3">{t('barcode')}: {scanResult.barcode}</p>
                    <p className="text-sm text-gray-600 mb-3">{t('itemNotInDatabase')}</p>
                    <button
                      onClick={() => {
                        alert(`${t('addNewItem')} ${t('barcode')}: ${scanResult.barcode}`);
                        setScanResult(null);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      {t('addToDatabase')}
                    </button>
                  </div>
                )}

                <div className="mt-4 text-center">
                  <button
                    onClick={() => {
                      setScanResult(null);
                      setScanType('prize');
                    }}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    {t('startNewTransaction')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Other tabs with API notices */}
      {activeTab !== 'scan' && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <APINotice 
            feature={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management`} 
            cost="Low" 
          />
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('comingSoon')}
            </h3>
            <p className="text-gray-600 mb-4">
              {t('thisFeatureIsBeingDeveloped')}
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-blue-700">
                <strong>Production Ready:</strong> This tab will show the full {activeTab} management interface with real AWS API integration.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;