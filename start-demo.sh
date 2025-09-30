#!/bin/bash

echo "🚀 Starting Membership Points App Demo..."

# Navigate to frontend directory
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🔧 Setting up demo mode..."

# Copy demo files
cp src/index-demo.js src/index.js 2>/dev/null || echo "index.js already updated"
cp src/App-demo.js src/App.js 2>/dev/null || echo "App.js already updated"
cp src/contexts/AuthContext-demo.js src/contexts/AuthContext.js 2>/dev/null || echo "AuthContext.js already updated"
cp src/contexts/SettingsContext-demo.js src/contexts/SettingsContext.js 2>/dev/null || echo "SettingsContext.js already updated"

echo "✅ Demo setup complete!"
echo ""
echo "🌟 Starting the app..."
echo "📱 Open http://localhost:3000 in your browser"
echo ""
echo "🎯 Demo Features:"
echo "   • Login as Demo User (regular member)"
echo "   • Login as Demo Admin (full access)"
echo "   • Test owner-controlled chatbot"
echo "   • Mobile responsive design"
echo ""

# Start the development server
npm start