import React, { createContext, useContext, useState, useEffect } from 'react';

const SharedDataContext = createContext();

export const useSharedData = () => {
  const context = useContext(SharedDataContext);
  if (!context) {
    throw new Error('useSharedData must be used within a SharedDataProvider');
  }
  return context;
};

// Demo data with production-like structure
const DEMO_DATA = {
  members: [
    { id: '1', username: 'john_doe', name: 'John Doe', email: 'john@example.com', points: 1250, phone: '+1234567890', gender: 'male', birthday: '1990-01-01' },
    { id: '2', username: 'jane_smith', name: 'Jane Smith', email: 'jane@example.com', points: 890, phone: '+1234567891', gender: 'female', birthday: '1985-05-15' },
    { id: '3', username: 'mike_johnson', name: 'Mike Johnson', email: 'mike@example.com', points: 2100, phone: '+1234567892', gender: 'male', birthday: '1992-08-20' },
    { id: '4', username: 'sarah_wilson', name: 'Sarah Wilson', email: 'sarah@example.com', points: 450, phone: '+1234567893', gender: 'female', birthday: '1988-12-03' },
    { id: '5', username: 'david_brown', name: 'David Brown', email: 'david@example.com', points: 1800, phone: '+1234567894', gender: 'male', birthday: '1991-03-10' },
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
  branches: [
    { id: '1', name: 'Downtown Branch', location: '123 Main St, Downtown', whatsapp: '+852 9876 5432', phone: '+852 2345 6789' },
    { id: '2', name: 'Mall Branch', location: '456 Shopping Center, Mall District', whatsapp: '+852 9876 5433', phone: '+852 2345 6790' },
    { id: '3', name: 'Airport Branch', location: '789 Terminal Rd, Airport', whatsapp: '+852 9876 5434', phone: '+852 2345 6791' }
  ],
  transactions: [
    { id: '1', memberId: '1', type: 'earn', itemName: 'Coffee - Medium', points: 15, timestamp: new Date('2024-01-15T10:30:00').toISOString(), branchId: '1' },
    { id: '2', memberId: '1', type: 'redeem', itemName: 'Free Coffee', points: -100, timestamp: new Date('2024-01-14T14:20:00').toISOString(), branchId: '1' },
    { id: '3', memberId: '2', type: 'earn', itemName: 'Sandwich', points: 25, timestamp: new Date('2024-01-13T12:15:00').toISOString(), branchId: '2' },
  ]
};

// API Notice Component
const APINotice = ({ feature, cost = "Low" }) => (
  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
    <div className="flex items-center space-x-2">
      <span className="text-blue-600">🔗</span>
      <div>
        <p className="text-sm font-medium text-blue-800">
          Production Feature: {feature}
        </p>
        <p className="text-xs text-blue-600">
          Requires AWS API • Estimated cost: {cost} • Currently using demo data
        </p>
      </div>
    </div>
  </div>
);

export const SharedDataProvider = ({ children }) => {
  // State management with localStorage persistence
  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('demo-members');
    return saved ? JSON.parse(saved) : DEMO_DATA.members;
  });
  
  const [prizes, setPrizes] = useState(() => {
    const saved = localStorage.getItem('demo-prizes');
    return saved ? JSON.parse(saved) : DEMO_DATA.prizes;
  });
  
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('demo-items');
    return saved ? JSON.parse(saved) : DEMO_DATA.items;
  });
  
  const [branches, setBranches] = useState(() => {
    const saved = localStorage.getItem('demo-branches');
    return saved ? JSON.parse(saved) : DEMO_DATA.branches;
  });
  
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('demo-transactions');
    return saved ? JSON.parse(saved) : DEMO_DATA.transactions;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('demo-members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('demo-prizes', JSON.stringify(prizes));
  }, [prizes]);

  useEffect(() => {
    localStorage.setItem('demo-items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('demo-branches', JSON.stringify(branches));
  }, [branches]);

  useEffect(() => {
    localStorage.setItem('demo-transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Simulate API calls with delays
  const simulateAPI = async (operation, delay = 800) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, delay));
      return operation();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Member operations
  const addMember = async (memberData) => {
    return simulateAPI(() => {
      const newMember = { ...memberData, id: Date.now().toString() };
      setMembers(prev => [...prev, newMember]);
      return newMember;
    });
  };

  const updateMember = async (id, updates) => {
    return simulateAPI(() => {
      setMembers(prev => prev.map(member => {
        if (member.id === id) {
          const updated = typeof updates === 'function' ? updates(member) : { ...member, ...updates };
          return updated;
        }
        return member;
      }));
      return members.find(m => m.id === id);
    });
  };

  const deleteMember = async (id) => {
    return simulateAPI(() => {
      setMembers(prev => prev.filter(member => member.id !== id));
    });
  };

  // Prize operations
  const addPrize = async (prizeData) => {
    return simulateAPI(() => {
      const newPrize = { ...prizeData, id: Date.now().toString() };
      setPrizes(prev => [...prev, newPrize]);
      return newPrize;
    });
  };

  const updatePrize = async (id, updates) => {
    return simulateAPI(() => {
      setPrizes(prev => prev.map(prize => 
        prize.id === id ? { ...prize, ...updates } : prize
      ));
      return prizes.find(p => p.id === id);
    });
  };

  const deletePrize = async (id) => {
    return simulateAPI(() => {
      setPrizes(prev => prev.filter(prize => prize.id !== id));
    });
  };

  // Item operations
  const addItem = async (itemData) => {
    return simulateAPI(() => {
      const newItem = { ...itemData, id: Date.now().toString() };
      setItems(prev => [...prev, newItem]);
      return newItem;
    });
  };

  const updateItem = async (id, updates) => {
    return simulateAPI(() => {
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      ));
      return items.find(i => i.id === id);
    });
  };

  const deleteItem = async (id) => {
    return simulateAPI(() => {
      setItems(prev => prev.filter(item => item.id !== id));
    });
  };

  // Branch operations
  const addBranch = async (branchData) => {
    return simulateAPI(() => {
      const newBranch = { ...branchData, id: Date.now().toString() };
      setBranches(prev => [...prev, newBranch]);
      return newBranch;
    });
  };

  const updateBranch = async (id, updates) => {
    return simulateAPI(() => {
      setBranches(prev => prev.map(branch => 
        branch.id === id ? { ...branch, ...updates } : branch
      ));
      return branches.find(b => b.id === id);
    });
  };

  const deleteBranch = async (id) => {
    return simulateAPI(() => {
      setBranches(prev => prev.filter(branch => branch.id !== id));
    });
  };

  // Transaction operations
  const addTransaction = async (transactionData) => {
    return simulateAPI(() => {
      const newTransaction = { 
        ...transactionData, 
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
      };
      setTransactions(prev => [newTransaction, ...prev]);
      return newTransaction;
    });
  };

  const getMemberTransactions = async (memberId) => {
    return simulateAPI(() => {
      return transactions.filter(transaction => transaction.memberId === memberId)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    });
  };

  // Process point transaction
  const processPointTransaction = async (memberId, points, type, itemName, branchId) => {
    return simulateAPI(async () => {
      // Update member points
      await updateMember(memberId, (prevMember) => ({
        ...prevMember,
        points: prevMember.points + (type === 'earn' ? points : -points)
      }));

      // Create transaction record
      const transaction = await addTransaction({
        memberId,
        type,
        itemName,
        points: type === 'earn' ? points : -points,
        branchId
      });

      return transaction;
    });
  };

  // Search functions
  const searchMembers = async (query) => {
    return simulateAPI(() => {
      if (!query.trim()) return [];
      return members.filter(member => 
        member.name.toLowerCase().includes(query.toLowerCase()) ||
        member.username.toLowerCase().includes(query.toLowerCase()) ||
        member.email.toLowerCase().includes(query.toLowerCase())
      );
    }, 300);
  };

  // Barcode recognition function
  const recognizeBarcode = (barcode) => {
    // Check if it's a prize barcode (starts with 2)
    const prize = prizes.find(p => p.barcode === barcode);
    if (prize) {
      return {
        type: 'prize',
        data: prize,
        action: 'deduct',
        points: prize.cost_points
      };
    }

    // Check if it's an item barcode (starts with 1)
    const item = items.find(i => i.barcode === barcode);
    if (item) {
      return {
        type: 'item',
        data: item,
        action: 'add',
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
    branches,
    transactions,
    loading,
    error,
    
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
    
    // API Notice Component
    APINotice,
  };

  return (
    <SharedDataContext.Provider value={value}>
      {children}
    </SharedDataContext.Provider>
  );
};