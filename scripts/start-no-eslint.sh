#!/bin/bash

echo "🚀 Starting React App with ESLint Completely Disabled"
echo "===================================================="

cd frontend

echo "1. Killing any existing Node processes..."
pkill -f "react-scripts" || true
pkill -f "webpack" || true

echo "2. Clearing caches..."
rm -rf node_modules/.cache
rm -rf .eslintcache

echo "3. Setting environment variables..."
export DISABLE_ESLINT_PLUGIN=true
export ESLINT_NO_DEV_ERRORS=true
export TSC_COMPILE_ON_ERROR=true

echo "4. Starting development server with ESLint disabled..."
echo "   The app should load without any ESLint errors!"

DISABLE_ESLINT_PLUGIN=true ESLINT_NO_DEV_ERRORS=true npm start