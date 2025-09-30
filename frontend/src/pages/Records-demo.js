import React, { useState, useEffect } from 'react';
import { useDemoAuth } from '../components/DemoAuthenticator';
import { useLanguage } from '../contexts/LanguageContext';
import { useSharedData } from '../contexts/SharedDataContext-demo';

const Records = () => {
  const { user, userType } = useDemoAuth();
  const { t } = useLanguage();
  const { getMemberTransactions, members } = useSharedData();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = () => {
      setLoading(true);
      try {
        // For demo user, find their member record and get transactions
        if (userType === 'user') {
          const memberData = members.find(m => m.username === 'john_doe');
          if (memberData) {
            const memberTransactions = getMemberTransactions(memberData.id);
            setTransactions(memberTransactions);
          }
        } else {
          // For admin/sales, show sample transactions
          setTransactions([
            {
              id: '1',
              type: 'earn',
              itemName: 'Coffee - Medium',
              points: 15,
              timestamp: new Date('2024-01-15T10:30:00').toISOString(),
              branchId: '1'
            },
            {
              id: '2',
              type: 'redeem',
              itemName: 'Free Coffee',
              points: -100,
              timestamp: new Date('2024-01-14T14:20:00').toISOString(),
              branchId: '1'
            }
          ]);
        }
      } catch (error) {
        console.error('Error loading transactions:', error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [userType, members, getMemberTransactions]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('transactionHistory')}</h1>
        
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noTransactions')}</h3>
            <p className="text-gray-500">{t('noTransactionsDescription')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'earn' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.type === 'earn' ? '+' : '-'}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {transaction.itemName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(transaction.timestamp)}
                    </div>
                  </div>
                </div>
                <div className={`text-lg font-semibold ${
                  transaction.type === 'earn' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {transaction.type === 'earn' ? '+' : ''}{transaction.points}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Demo Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">{t('demoData')}</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>{t('demoDataDescription')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Records;