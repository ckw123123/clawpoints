#!/bin/bash

# Public Demo Build Script for ClawPoints
echo "🌐 Building ClawPoints Public Demo..."

# Check if we're in the right directory
if [ ! -f "frontend/package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Navigate to frontend
cd frontend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building production bundle..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo ""
    echo "📁 Build files are in: frontend/build/"
    echo ""
    echo "🚀 Deployment Options:"
    echo ""
    echo "1. Netlify (Recommended):"
    echo "   netlify deploy --prod --dir=build"
    echo ""
    echo "2. Vercel:"
    echo "   vercel --prod"
    echo ""
    echo "3. GitHub Pages:"
    echo "   npm run deploy"
    echo ""
    echo "4. AWS S3:"
    echo "   aws s3 sync build/ s3://your-bucket-name --delete"
    echo ""
    echo "📖 Full deployment guide: PUBLIC-DEMO-DEPLOYMENT.md"
    echo ""
    echo "🎮 Demo Features:"
    echo "   • Production-like authentication"
    echo "   • Intelligent barcode recognition"
    echo "   • Multi-language support (EN/ZH)"
    echo "   • Role-based access control"
    echo "   • API cost highlighting"
    echo ""
    echo "👥 Demo Accounts:"
    echo "   Admin: admin / demo123"
    echo "   Sales: sales / demo123"
    echo "   Member: member / demo123"
else
    echo "❌ Build failed!"
    exit 1
fi