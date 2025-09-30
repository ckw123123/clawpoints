import React, { useState, useEffect } from 'react';
import { useDemoAuth } from '../components/DemoAuthenticator';
import { useLanguage } from '../contexts/LanguageContext';
import { useSharedData } from '../contexts/SharedDataContext-demo';

const Records = () => {
  const { userType } = useDemoAuth();
  const { t, isChinese } = useLanguage();
  const { members, branches } = useSharedData();
  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const RECORDS_PER_PAGE = 10;

  useEffect(() => {
    const loadTransactions = () => {
      setLoading(true);
      try {
        // For demo user, create detailed transaction history with branch info and running balance
        if (userType === 'user') {
          const memberData = members.find(m => m.username === 'john_doe');
          if (memberData) {
            // Create comprehensive transaction history - 25 records for pagination demo
            const transactionHistory = [
              { id: '25', type: 'earn', itemName: 'Coffee - Medium', points: 15, timestamp: new Date('2024-01-25T10:30:00').toISOString(), branchId: '1', balanceAfter: 1250 },
              { id: '24', type: 'redeem', itemName: '糖果', points: -50, timestamp: new Date('2024-01-24T15:45:00').toISOString(), branchId: '3', balanceAfter: 1235 },
              { id: '23', type: 'earn', itemName: 'Salad', points: 30, timestamp: new Date('2024-01-23T12:20:00').toISOString(), branchId: '2', balanceAfter: 1285 },
              { id: '22', type: 'earn', itemName: 'Coffee - Large', points: 20, timestamp: new Date('2024-01-22T09:15:00').toISOString(), branchId: '1', balanceAfter: 1255 },
              { id: '21', type: 'redeem', itemName: '小公仔', points: -100, timestamp: new Date('2024-01-21T14:30:00').toISOString(), branchId: '2', balanceAfter: 1235 },
              { id: '20', type: 'earn', itemName: 'Sandwich', points: 25, timestamp: new Date('2024-01-20T11:45:00').toISOString(), branchId: '3', balanceAfter: 1335 },
              { id: '19', type: 'earn', itemName: 'Pastry', points: 15, timestamp: new Date('2024-01-19T16:20:00').toISOString(), branchId: '1', balanceAfter: 1310 },
              { id: '18', type: 'earn', itemName: 'Coffee - Small', points: 10, timestamp: new Date('2024-01-18T08:30:00').toISOString(), branchId: '2', balanceAfter: 1295 },
              { id: '17', type: 'redeem', itemName: '禮品卡 $10', points: -200, timestamp: new Date('2024-01-17T13:15:00').toISOString(), branchId: '3', balanceAfter: 1285 },
              { id: '16', type: 'earn', itemName: 'Coffee - Medium', points: 15, timestamp: new Date('2024-01-16T10:00:00').toISOString(), branchId: '1', balanceAfter: 1485 },
              { id: '15', type: 'earn', itemName: 'Sandwich', points: 25, timestamp: new Date('2024-01-15T12:30:00').toISOString(), branchId: '2', balanceAfter: 1470 },
              { id: '14', type: 'redeem', itemName: 'T恤', points: -300, timestamp: new Date('2024-01-14T14:45:00').toISOString(), branchId: '1', balanceAfter: 1445 },
              { id: '13', type: 'earn', itemName: 'Coffee - Large', points: 20, timestamp: new Date('2024-01-13T09:20:00').toISOString(), branchId: '3', balanceAfter: 1745 },
              { id: '12', type: 'earn', itemName: 'Pastry', points: 15, timestamp: new Date('2024-01-12T15:10:00').toISOString(), branchId: '2', balanceAfter: 1725 },
              { id: '11', type: 'earn', itemName: 'Salad', points: 30, timestamp: new Date('2024-01-11T11:30:00').toISOString(), branchId: '1', balanceAfter: 1710 },
              { id: '10', type: 'redeem', itemName: '公仔大獎', points: -500, timestamp: new Date('2024-01-10T16:00:00').toISOString(), branchId: '3', balanceAfter: 1680 },
              { id: '9', type: 'earn', itemName: 'Coffee - Medium', points: 15, timestamp: new Date('2024-01-09T08:45:00').toISOString(), branchId: '2', balanceAfter: 2180 },
              { id: '8', type: 'earn', itemName: 'Sandwich', points: 25, timestamp: new Date('2024-01-08T12:15:00').toISOString(), branchId: '1', balanceAfter: 2165 },
              { id: '7', type: 'earn', itemName: 'Coffee - Small', points: 10, timestamp: new Date('2024-01-07T07:30:00').toISOString(), branchId: '3', balanceAfter: 2140 },
              { id: '6', type: 'redeem', itemName: '糖果', points: -50, timestamp: new Date('2024-01-06T14:20:00').toISOString(), branchId: '2', balanceAfter: 2130 },
              { id: '5', type: 'earn', itemName: 'Pastry', points: 15, timestamp: new Date('2024-01-05T10:10:00').toISOString(), branchId: '1', balanceAfter: 2180 },
              { id: '4', type: 'earn', itemName: 'Coffee - Large', points: 20, timestamp: new Date('2024-01-04T09:00:00').toISOString(), branchId: '3', balanceAfter: 2165 },
              { id: '3', type: 'earn', itemName: 'Salad', points: 30, timestamp: new Date('2024-01-03T13:30:00').toISOString(), branchId: '2', balanceAfter: 2145 },
              { id: '2', type: 'redeem', itemName: '小公仔', points: -100, timestamp: new Date('2024-01-02T15:45:00').toISOString(), branchId: '1', balanceAfter: 2115 },
              { id: '1', type: 'earn', itemName: 'Coffee - Medium', points: 15, timestamp: new Date('2024-01-01T11:00:00').toISOString(), branchId: '3', balanceAfter: 2215 }
            ];
            setAllTransactions(transactionHistory);
          }
        }
      } catch (error) {
        console.error('Error loading transactions:', error);
        setAllTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [userType, members]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBranchInfo = (branchId) => {
    const branch = branches.find(b => b.id === branchId);
    if (!branch) return { name: 'Unknown Branch', nameEn: 'Unknown Branch', phone: '' };
    
    return {
      name: branch.name,
      nameEn: branch.nameEn,
      phone: branch.phone
    };
  };

  // Pagination logic
  const totalPages = Math.ceil(allTransactions.length / RECORDS_PER_PAGE);
  const startIndex = (currentPage - 1) * RECORDS_PER_PAGE;
  const endIndex = startIndex + RECORDS_PER_PAGE;
  const currentTransactions = allTransactions.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    // Scroll to top of transactions list
    document.getElementById('transactions-list')?.scrollIntoView({ behavior: 'smooth' });
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Balance - At the top */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-blue-100">{t('currentBalance')}</h2>
            <div className="text-3xl font-bold">1,250 {t('points')}</div>
          </div>
          <div className="text-4xl">💰</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6" id="transactions-list">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t('transactionRecords')}</h1>
          {allTransactions.length > 0 && (
            <div className="text-sm text-gray-500">
              {t('showing')} {startIndex + 1}-{Math.min(endIndex, allTransactions.length)} {t('of')} {allTransactions.length} {t('records')}
            </div>
          )}
        </div>
        
        {allTransactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noTransactions')}</h3>
            <p className="text-gray-500">{t('startEarning')}</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {currentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        transaction.type === 'earn' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {transaction.type === 'earn' ? '+' : '-'}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {transaction.itemName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(transaction.timestamp)}
                        </div>
                        <div className="text-sm text-blue-600">
                          📍 {isChinese ? getBranchInfo(transaction.branchId).name : getBranchInfo(transaction.branchId).nameEn}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-lg font-semibold ${
                        transaction.type === 'earn' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {transaction.type === 'earn' ? '+' : ''}{transaction.points}
                      </div>
                      <div className="text-sm text-gray-500">
                        {t('balance')}: {transaction.balanceAfter.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="flex items-center text-sm text-gray-700">
                  <span>
                    {t('page')} {currentPage} {t('of')} {totalPages}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {t('previous')}
                  </button>
                  
                  {/* Page Numbers */}
                  <div className="flex space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                            pageNum === currentPage
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {t('next')}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>


    </div>
  );
};

export default Records;