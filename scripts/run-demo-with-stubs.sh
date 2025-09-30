#!/bin/bash

# Demo Script with Stub Files - Creates temporary stub files to satisfy imports

echo "🚀 Starting Demo with Stub Files..."

# Check if we're in the right directory
if [ ! -d "frontend" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

cd frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Create backup of original files
echo "🔧 Creating backups and stub files..."
if [ -f "src/contexts/AuthContext.js" ]; then
    cp src/contexts/AuthContext.js src/contexts/AuthContext.js.bak
fi
if [ -f "src/contexts/SharedDataContext.js" ]; then
    cp src/contexts/SharedDataContext.js src/contexts/SharedDataContext.js.bak
fi

# Create stub AuthContext
cat > src/contexts/AuthContext.js << 'EOF'
import React, { createContext, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return {
    user: null,
    loading: false,
    signOut: () => {},
    isAdmin: false,
    isSales: false,
    userRole: 'member',
    canManageUsers: false,
    canManageMembers: false
  };
};

export const AuthProvider = ({ children }) => {
  return (
    <AuthContext.Provider value={{}}>
      {children}
    </AuthContext.Provider>
  );
};
EOF

# Create stub SharedDataContext
cat > src/contexts/SharedDataContext.js << 'EOF'
import React, { createContext, useContext } from 'react';

const SharedDataContext = createContext();

export const useSharedData = () => {
  return {
    members: [],
    prizes: [],
    items: [],
    users: [],
    branches: [],
    transactions: [],
    addMember: () => {},
    updateMember: () => {},
    deleteMember: () => {},
    addPrize: () => {},
    updatePrize: () => {},
    deletePrize: () => {},
    addItem: () => {},
    updateItem: () => {},
    deleteItem: () => {},
    addUser: () => {},
    updateUser: () => {},
    deleteUser: () => {},
    addBranch: () => {},
    updateBranch: () => {},
    deleteBranch: () => {},
    addTransaction: () => {},
    getMemberTransactions: () => [],
    searchMembers: () => [],
    recognizeBarcode: () => ({ type: 'unknown' })
  };
};

export const SharedDataProvider = ({ children }) => {
  return (
    <SharedDataContext.Provider value={{}}>
      {children}
    </SharedDataContext.Provider>
  );
};
EOF

# Function to restore files on exit
restore_files() {
    echo "🔄 Restoring original files..."
    if [ -f "src/contexts/AuthContext.js.bak" ]; then
        mv src/contexts/AuthContext.js.bak src/contexts/AuthContext.js
    fi
    if [ -f "src/contexts/SharedDataContext.js.bak" ]; then
        mv src/contexts/SharedDataContext.js.bak src/contexts/SharedDataContext.js
    fi
    echo "✅ Files restored"
}

# Set trap to restore files on script exit
trap restore_files EXIT

echo "✅ Demo ready!"
echo ""
echo "🔑 Demo Login Options:"
echo "   🔵 Demo User (Member) - View points and transactions"
echo "   🟣 Demo Sales - Manage members, prizes, items"  
echo "   🟢 Demo Admin - Full system access including user management"
echo ""
echo "🚀 Starting demo server..."
echo "   URL: http://localhost:3000"
echo "   Press Ctrl+C to stop and restore files"
echo ""

# Start the demo with environment variable
REACT_APP_DEMO=true npm start