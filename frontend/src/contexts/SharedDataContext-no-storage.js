import React, { createContext, useContext, useState } from 'react';

const SharedDataContext = createContext();

export const useSharedData = () => {
  const context = useContext(SharedDataContext);
  if (!context) {
    throw new Error('useSharedData must be used within a SharedDataProvider');
  }
  return context;
};

// Initial demo data - no localStorage, just in-memory
const INITIAL_DATA = {
  transactions: [
    { id: '1', memberId: '1', type: 'earn', itemName: 'Coffee - Medium', points: 15, timestamp: new Date('2024-01-15T10:30:00').toISOString(), branchId: '1' },
    { id: '2', memberId: '1', type: 'redeem', itemName: 'Free Coffee', points: -100, timestamp: new Date('2024-01-14T14:20:00').toISOString(), branchId: '1' },
    { id: '3', memberId: '2', type: 'earn', itemName: 'Sandwich', points: 25, timestamp: new Date('2024-01-13T12:15:00').toISOString(), branchId: '2' },
    { id: '4', memberId: '3', type: 'earn', itemName: 'Coffee - Large', points: 20, timestamp: new Date('2024-01-12T09:45:00').toISOString(), branchId: '1' },
    { id: '5', memberId: '1', type: 'earn', itemName: 'Pastry', points: 15, timestamp: new Date('2024-01-11T16:30:00').toISOString(), branchId: '1' }
  ],
  members: [
    { id: '1', username: 'john_doe', name: 'John Doe', email: 'john@example.com', points: 1250, phone: '+1234567890', gender: 'male', birthday: '1990-01-01', password: 'demo123' },
    { id: '2', username: 'jane_smith', name: 'Jane Smith', email: 'jane@example.com', points: 890, phone: '+1234567891', gender: 'female', birthday: '1985-05-15', password: 'demo123' },
    { id: '3', username: 'mike_johnson', name: 'Mike Johnson', email: 'mike@example.com', points: 2100, phone: '+1234567892', gender: 'male', birthday: '1992-08-20', password: 'demo123' }
  ],
  prizes: [
    { id: '1', name: '小公仔', cost_points: 100, stock: 50, description: '可愛小公仔', barcode: '2001001001001', points_reward: 2 },
    { id: '2', name: '糖果', cost_points: 50, stock: 100, description: '美味糖果', barcode: '2001001001002', points_reward: 1 },
    { id: '3', name: '公仔大獎', cost_points: 500, stock: 20, description: '限量版大公仔', barcode: '2001001001003', points_reward: 5 },
    { id: '4', name: '禮品卡 $10', cost_points: 200, stock: 30, description: '$10 購物禮品卡', barcode: '2001001001004', points_reward: 3 },
    { id: '5', name: 'T恤', cost_points: 300, stock: 15, description: '品牌T恤', barcode: '2001001001005', points_reward: 4 }
  ],
  items: [
    { id: '1', name: 'Coffee - Small', barcode: '1001001001001', points_value: 10 },
    { id: '2', name: 'Coffee - Medium', barcode: '1001001001002', points_value: 15 },
    { id: '3', name: 'Coffee - Large', barcode: '1001001001003', points_value: 20 },
    { id: '4', name: 'Sandwich', barcode: '1001001001004', points_value: 25 },
    { id: '5', name: 'Pastry', barcode: '1001001001005', points_value: 15 },
    { id: '6', name: 'Salad', barcode: '1001001001006', points_value: 30 }
  ],
  users: [
    { id: '1', username: 'demoadmin', name: 'Demo Admin', email: 'admin@example.com', role: 'admin' },
    { id: '2', username: 'demosales', name: 'Demo Sales', email: 'sales@example.com', role: 'sales' }
  ],
  branches: [
    { 
      id: '1', 
      name: '旺角 信和中心 101 號鋪',
      nameEn: 'Shop 101, Sino Centre, Mong Kok',
      whatsapp: '+852 5522 3344', 
      phone: '+852 5522 3344' 
    },
    { 
      id: '2', 
      name: '石門 京瑞廣場一期 201 號舖',
      nameEn: 'Shop 201, Phase 1, Kings Wing Plaza, Shek Mun',
      whatsapp: '+852 6622 3388', 
      phone: '+852 6622 3388' 
    },
    { 
      id: '3', 
      name: '旺角中心一期 2樓 S66A',
      nameEn: 'Shop S66A, 2/F, Argyle Centre Phase 1, Mong Kok',
      whatsapp: '+852 9922 8833', 
      phone: '+852 9922 8833' 
    }
  ]
};

export const SharedDataProvider = ({ children }) => {
  // Initialize data from INITIAL_DATA - no localStorage
  const [members, setMembers] = useState(INITIAL_DATA.members);
  const [prizes, setPrizes] = useState(INITIAL_DATA.prizes);
  const [items, setItems] = useState(INITIAL_DATA.items);
  const [users, setUsers] = useState(INITIAL_DATA.users);
  const [branches, setBranches] = useState(INITIAL_DATA.branches);
  const [transactions, setTransactions] = useState(INITIAL_DATA.transactions);

  // CRUD operations for Members
  const addMember = (member) => {
    const newMember = { 
      ...member, 
      id: Date.now().toString(),
      qrCode: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    setMembers(prev => [...prev, newMember]);
    return newMember;
  };

  const updateMember = (id, updates) => {
    setMembers(prev => prev.map(member => {
      if (member.id === id) {
        return typeof updates === 'function' ? updates(member) : { ...member, ...updates };
      }
      return member;
    }));
  };

  const deleteMember = (id) => {
    setMembers(prev => prev.filter(member => member.id !== id));
  };

  // CRUD operations for Prizes
  const addPrize = (prize) => {
    const newPrize = { ...prize, id: Date.now().toString() };
    setPrizes(prev => [...prev, newPrize]);
    return newPrize;
  };

  const updatePrize = (id, updates) => {
    setPrizes(prev => prev.map(prize => 
      prize.id === id ? { ...prize, ...updates } : prize
    ));
  };

  const deletePrize = (id) => {
    setPrizes(prev => prev.filter(prize => prize.id !== id));
  };

  // CRUD operations for Items
  const addItem = (item) => {
    const newItem = { ...item, id: Date.now().toString() };
    setItems(prev => [...prev, newItem]);
    return newItem;
  };

  const updateItem = (id, updates) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // Transaction operations
  const addTransaction = (transaction) => {
    const newTransaction = { 
      ...transaction, 
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setTransactions(prev => [newTransaction, ...prev]);
    return newTransaction;
  };

  const getMemberTransactions = (memberId) => {
    return transactions.filter(transaction => transaction.memberId === memberId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  // Process point transaction
  const processPointTransaction = (memberId, points, type, itemName, branchId = '1') => {
    updateMember(memberId, (prevMember) => ({
      ...prevMember,
      points: prevMember.points + (type === 'earn' ? points : -points)
    }));

    const transaction = addTransaction({
      memberId,
      type,
      itemName,
      points: type === 'earn' ? points : -points,
      branchId
    });

    return transaction;
  };

  // Barcode recognition function
  const recognizeBarcode = (barcode) => {
    // Check if it's a prize barcode (starts with 2)
    const prize = prizes.find(p => p.barcode === barcode);
    if (prize) {
      return {
        type: 'prize',
        data: prize,
        action: 'deduct', // Prizes deduct points when redeemed
        points: prize.cost_points
      };
    }

    // Check if it's an item barcode (starts with 1)
    const item = items.find(i => i.barcode === barcode);
    if (item) {
      return {
        type: 'item',
        data: item,
        action: 'add', // Items add points when purchased
        points: item.points_value
      };
    }

    // Unknown barcode
    return {
      type: 'unknown',
      barcode: barcode,
      error: 'Barcode not found in database'
    };
  };

  const value = {
    // Data
    members,
    prizes,
    items,
    users,
    branches,
    transactions,
    
    // Member operations
    addMember,
    updateMember,
    deleteMember,
    
    // Prize operations
    addPrize,
    updatePrize,
    deletePrize,
    
    // Item operations
    addItem,
    updateItem,
    deleteItem,
    
    // Transaction operations
    addTransaction,
    getMemberTransactions,
    processPointTransaction,
    
    // Barcode recognition
    recognizeBarcode
  };

  return (
    <SharedDataContext.Provider value={value}>
      {children}
    </SharedDataContext.Provider>
  );
};