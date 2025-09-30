#!/bin/bash

# Isolated Demo Script - Temporarily hides production files to avoid compilation issues

echo "🚀 Starting Isolated Demo..."

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

# Temporarily rename problematic production files
echo "🔧 Temporarily hiding production files..."
if [ -f "src/contexts/AuthContext.js" ]; then
    mv src/contexts/AuthContext.js src/contexts/AuthContext.js.bak
fi
if [ -f "src/contexts/SharedDataContext.js" ]; then
    mv src/contexts/SharedDataContext.js src/contexts/SharedDataContext.js.bak
fi

# Function to restore files on exit
restore_files() {
    echo "🔄 Restoring production files..."
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