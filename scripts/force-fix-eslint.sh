#!/bin/bash

echo "🔧 Force fixing ESLint hooks error..."
echo "=================================="

# Navigate to frontend directory
cd frontend

echo "1. Stopping any running processes..."
pkill -f "react-scripts" || true
pkill -f "webpack" || true

echo "2. Clearing all caches..."
rm -rf node_modules/.cache
rm -rf .eslintcache
rm -rf build
rm -rf dist

echo "3. Clearing npm cache..."
npm cache clean --force

echo "4. Clearing system temp files..."
rm -rf /tmp/react-*
rm -rf ~/.npm/_cacache

echo "5. Reinstalling dependencies..."
npm install

echo "6. Starting development server..."
echo "   If the error persists, it might be a VS Code/IDE cache issue."
echo "   Try restarting your IDE or editor."

npm start