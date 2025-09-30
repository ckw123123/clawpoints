import React, { createContext, useContext, useState, useEffect } from 'react';

const SharedDataContext = createContext();

export const useSharedData = () => {
  const context = useContext(SharedDataContext);
  if (!context) {
    throw new Error('useSharedData must be used within a SharedDataProvider');
  }
  return context;
};

// Simulated shared database using localStorage
const STORAGE_KEYS = {
  members: 'demo_shared_members',
  prizes: 'demo_shared_prizes',
  items: 'demo_shared_items',
  users: 'demo_shared_users',
  branches: 'demo_shared_branches',
  transactions: 'demo_shared_transactions'
};

// Initial demo data
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
    { id: '3', username: 'mike_johnson', name: 'Mike Johnson', email: 'mike@example.com', points: 2100, phone: '+1234567892', gender: 'male', birthday: '1992-08-20', password: 'demo123' },
    { id: '4', username: 'sarah_wilson', name: 'Sarah Wilson', email: 'sarah@example.com', points: 450, phone: '+1234567893', gender: 'female', birthday: '1988-12-03', password: 'demo123' },
    { id: '5', username: 'david_brown', name: 'David Brown', email: 'david@example.com', points: 1800, phone: '+1234567894', gender: 'male', birthday: '1991-03-10', password: 'demo123' },
    { id: '6', username: 'lisa_davis', name: 'Lisa Davis', email: 'lisa@example.com', points: 320, phone: '+1234567895', gender: 'female', birthday: '1987-07-22', password: 'demo123' },
    { id: '7', username: 'tom_miller', name: 'Tom Miller', email: 'tom@example.com', points: 950, phone: '+1234567896', gender: 'male', birthday: '1993-11-14', password: 'demo123' },
    { id: '8', username: 'amy_garcia', name: 'Amy Garcia', email: 'amy@example.com', points: 1500, phone: '+1234567897', gender: 'female', birthday: '1989-04-18', password: 'demo123' },
    { id: '9', username: 'chris_lee', name: 'Chris Lee', email: 'chris@example.com', points: 680, phone: '+1234567898', gender: 'male', birthday: '1994-09-25', password: 'demo123' },
    { id: '10', username: 'emma_white', name: 'Emma White', email: 'emma@example.com', points: 2200, phone: '+1234567899', gender: 'female', birthday: '1986-06-12', password: 'demo123' }
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
    { id: '2', username: 'demosales', name: 'Demo Sales', email: 'sales@example.com', role: 'sales' },
    { id: '3', username: 'sales2', name: 'Sales User 2', email: 'sales2@example.com', role: 'sales' }
  ],
  branches: [
    { id: '1', name: 'Downtown Branch', location: '123 Main St, Downtown', whatsapp: '+852 9876 5432', phone: '+852 2345 6789' },
    { id: '2', name: 'Mall Branch', location: '456 Shopping Center, Mall District', whatsapp: '+852 9876 5433', phone: '+852 2345 6790' },
    { id: '3', name: 'Airport Branch', location: '789 Terminal Rd, Airport', whatsapp: '+852 9876 5434', phone: '+852 2345 6791' }
  ]
};

// Helper functions for localStorage operations
const loadFromStorage = (key, defaultValue) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from storage:`, error);
    return defaultValue;
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
};

export const SharedDataProvider = ({ children }) => {
  // Initialize data from localStorage or use defaults
  const [members, setMembers] = useState(() => 
    loadFromStorage(STORAGE_KEYS.members, INITIAL_DATA.members)
  );
  const [prizes, setPrizes] = useState(() => 
    loadFromStorage(STORAGE_KEYS.prizes, INITIAL_DATA.prizes)
  );
  const [items, setItems] = useState(() => 
    loadFromStorage(STORAGE_KEYS.items, INITIAL_DATA.items)
  );
  const [users, setUsers] = useState(() => 
    loadFromStorage(STORAGE_KEYS.users, INITIAL_DATA.users)
  );
  const [branches, setBranches] = useState(() => 
    loadFromStorage(STORAGE_KEYS.branches, INITIAL_DATA.branches)
  );
  const [transactions, setTransactions] = useState(() => 
    loadFromStorage(STORAGE_KEYS.transactions, INITIAL_DATA.transactions)
  );

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.members, members);
  }, [members]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.prizes, prizes);
  }, [prizes]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.items, items);
  }, [items]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.users, users);
  }, [users]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.branches, branches);
  }, [branches]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.transactions, transactions);
  }, [transactions]);

  // CRUD operations for Members
  const addMember = (member) => {
    const newMember = { ...member, id: Date.now().toString() };
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

  // CRUD operations for Users
  const addUser = (user) => {
    const newUser = { ...user, id: Date.now().toString() };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const updateUser = (id, updates) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...updates } : user
    ));
  };

  const deleteUser = (id) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  // CRUD operations for Branches
  const addBranch = (branch) => {
    const newBranch = { ...branch, id: Date.now().toString() };
    setBranches(prev => [...prev, newBranch]);
    return newBranch;
  };

  const updateBranch = (id, updates) => {
    setBranches(prev => prev.map(branch => 
      branch.id === id ? { ...branch, ...updates } : branch
    ));
  };

  const deleteBranch = (id) => {
    setBranches(prev => prev.filter(branch => branch.id !== id));
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

  // Process point transaction (earn or redeem)
  const processPointTransaction = (memberId, points, type, itemName, branchId = '1') => {
    // Update member points
    updateMember(memberId, (prevMember) => ({
      ...prevMember,
      points: prevMember.points + (type === 'earn' ? points : -points)
    }));

    // Create transaction record
    const transaction = addTransaction({
      memberId,
      type,
      itemName,
      points: type === 'earn' ? points : -points,
      branchId
    });

    return transaction;
  };

  // Search functions
  const searchMembers = (query) => {
    if (!query.trim()) return [];
    return members.filter(member => 
      member.name.toLowerCase().includes(query.toLowerCase()) ||
      member.username.toLowerCase().includes(query.toLowerCase()) ||
      member.email.toLowerCase().includes(query.toLowerCase())
    );
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

  // Reset function for demo purposes
  const resetAllData = () => {
    setMembers(INITIAL_DATA.members);
    setPrizes(INITIAL_DATA.prizes);
    setItems(INITIAL_DATA.items);
    setUsers(INITIAL_DATA.users);
    setBranches(INITIAL_DATA.branches);
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
    searchMembers,
    
    // Prize operations
    addPrize,
    updatePrize,
    deletePrize,
    
    // Item operations
    addItem,
    updateItem,
    deleteItem,
    
    // User operations
    addUser,
    updateUser,
    deleteUser,
    
    // Branch operations
    addBranch,
    updateBranch,
    deleteBranch,
    
    // Transaction operations
    addTransaction,
    getMemberTransactions,
    processPointTransaction,
    
    // Barcode recognition
    recognizeBarcode,
    
    // Utility
    resetAllData
  };

  return (
    <SharedDataContext.Provider value={value}>
      {children}
    </SharedDataContext.Provider>
  );
};