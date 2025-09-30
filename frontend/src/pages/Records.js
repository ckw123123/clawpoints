import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext-public';
import { useLanguage } from '../contexts/LanguageContext';
// Demo version - AWS API removed

const Records = () => {
  const { userProfile } = useAuth();
  const { t } = useLanguage();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, add, redeem

  useEffect(() => {
    const fetchTransactions = async () => {
      if (userProfile?.id) {
        try {
          // Demo version - mock transaction data with running balance
          const mockTransactions = [
            {
              id: '1',
              type: 'add',
              item_name: 'Coffee - Large',
              points: 20,
              created_at: new Date(Date.now() - 86400000).toISOString(),
              branch_name: 'Downtown Branch',
              balance_after: 1250 // Current balance
            },
            {
              id: '2',
              type: 'add',
              item_name: 'Sandwich',
              points: 25,
              created_at: new Date(Date.now() - 172800000).toISOString(),
              branch_name: 'Mall Branch',
              balance_after: 1230 // Balance before latest transaction
            },
            {
              id: '3',
              type: 'redeem',
              item_name: 'Free Coffee',
              points: 100,
              created_at: new Date(Date.now() - 259200000).toISOString(),
              branch_name: 'Downtown Branch',
              balance_after: 1205 // Balance before sandwich purchase
            },
            {
              id: '4',
              type: 'add',
              item_name: 'Pastry',
              points: 15,
              created_at: new Date(Date.now() - 345600000).toISOString(),
              branch_name: 'Airport Branch',
              balance_after: 1305 // Balance before coffee redemption
            },
            {
              id: '5',
              type: 'add',
              item_name: 'Coffee - Medium',
              points: 15,
              created_at: new Date(Date.now() - 432000000).toISOString(),
              branch_name: 'Downtown Branch',
              balance_after: 1290 // Balance before pastry
            }
          ];
          setTransactions(mockTransactions);
        } catch (error) {
          console.error('Error fetching transactions:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTransactions();
  }, [userProfile]);

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.type === filter;
  });

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type) => {
    return type === 'add' ? '➕' : '➖';
  };

  const getTransactionColor = (type) => {
    return type === 'add' ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">{t('transactionRecords')}</h2>
        
        {/* Filter Buttons */}
        <div className="flex space-x-2">
          {[
            { key: 'all', label: t('all') },
            { key: 'add', label: t('earned') },
            { key: 'redeem', label: t('redeemed') }
          ].map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === filterOption.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </div>

      {/* Current Points */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-2">{t('currentBalance')}</h3>
        <p className="text-3xl font-bold">
          {userProfile?.points?.toLocaleString() || '0'} {t('points')}
        </p>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-lg shadow-sm">
        {filteredTransactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-4">📝</div>
            <p>No transactions found</p>
            <p className="text-sm mt-2">Start earning points to see your transaction history!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">
                      {getTransactionIcon(transaction.type)}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">
                        {transaction.item_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(transaction.created_at)}
                      </p>
                      {transaction.branch_name && (
                        <p className="text-xs text-gray-400">
                          {transaction.branch_name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                      {transaction.type === 'add' ? '+' : '-'}{transaction.points} pts
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {t('balance')}: {transaction.balance_after?.toLocaleString()} pts
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {transactions.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-green-600">
              +{transactions
                .filter(t => t.type === 'add')
                .reduce((sum, t) => sum + t.points, 0)
                .toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">{t('totalEarned')}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-red-600">
              -{transactions
                .filter(t => t.type === 'redeem')
                .reduce((sum, t) => sum + t.points, 0)
                .toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">{t('totalRedeemed')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Records;