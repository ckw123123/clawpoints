#!/bin/bash

# Production Deployment Script for ClawPoints
echo "🚀 Starting ClawPoints Production Deployment..."

# Check if AWS CLI is configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

# Check if serverless is installed
if ! command -v serverless &> /dev/null; then
    echo "❌ Serverless Framework not found. Installing..."
    npm install -g serverless
fi

# Set production environment variables
export NODE_ENV=production
export STAGE=prod

echo "📋 Deployment Configuration:"
echo "  - Stage: $STAGE"
echo "  - Region: us-east-1"
echo "  - Environment: $NODE_ENV"

# Deploy Cognito User Pool first
echo "🔐 Deploying Cognito User Pool..."
cd infrastructure
aws cloudformation deploy \
    --template-file cognito-setup.yml \
    --stack-name clawpoints-cognito-prod \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides \
        Environment=prod \
        AppName=ClawPoints

# Get Cognito User Pool ID
COGNITO_USER_POOL_ID=$(aws cloudformation describe-stacks \
    --stack-name clawpoints-cognito-prod \
    --query 'Stacks[0].Outputs[?OutputKey==`UserPoolId`].OutputValue' \
    --output text)

if [ -z "$COGNITO_USER_POOL_ID" ]; then
    echo "❌ Failed to get Cognito User Pool ID"
    exit 1
fi

echo "✅ Cognito User Pool ID: $COGNITO_USER_POOL_ID"
export COGNITO_USER_POOL_ID

# Deploy backend API
echo "🔧 Deploying Backend API..."
cd ../backend

# Install dependencies
npm install

# Deploy serverless stack
serverless deploy --stage prod --verbose

# Get API Gateway URL
API_URL=$(serverless info --stage prod --verbose | grep -o 'https://[^[:space:]]*')

echo "✅ Backend API deployed successfully!"
echo "📡 API URL: $API_URL"

# Create environment file for frontend
echo "📝 Creating frontend environment configuration..."
cd ../frontend

cat > .env.production << EOF
REACT_APP_API_URL=$API_URL
REACT_APP_COGNITO_USER_POOL_ID=$COGNITO_USER_POOL_ID
REACT_APP_COGNITO_CLIENT_ID=\${COGNITO_CLIENT_ID}
REACT_APP_STAGE=prod
REACT_APP_REGION=us-east-1
EOF

echo "✅ Environment configuration created!"

# Seed initial data
echo "🌱 Seeding initial production data..."
cd ../scripts
node seed-data.js --stage=prod --api-url=$API_URL

# Get Cognito Client ID
COGNITO_CLIENT_ID=$(aws cloudformation describe-stacks \
    --stack-name clawpoints-cognito-prod \
    --query 'Stacks[0].Outputs[?OutputKey==`UserPoolClientId`].OutputValue' \
    --output text)

# Update frontend environment
cat > ../frontend/.env.production << EOF
REACT_APP_API_URL=$API_URL
REACT_APP_COGNITO_USER_POOL_ID=$COGNITO_USER_POOL_ID
REACT_APP_COGNITO_CLIENT_ID=$COGNITO_CLIENT_ID
REACT_APP_STAGE=prod
REACT_APP_REGION=us-east-1
REACT_APP_ENABLE_CAMERA_SCANNING=true
REACT_APP_ENABLE_CHATBOT=true
EOF

# Switch to production App.js
cd ../frontend
if [ ! -f "src/App-demo.js" ]; then
    mv src/App.js src/App-demo.js
fi
cp src/App-production.js src/App.js

echo "🎉 Production deployment completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Build frontend: cd frontend && npm run build"
echo "2. Deploy to S3/CloudFront (see PRODUCTION-DEPLOYMENT.md)"
echo "3. Configure custom domain and SSL"
echo "4. Create test users and verify functionality"
echo ""
echo "🔗 Resources:"
echo "  - API URL: $API_URL"
echo "  - Cognito User Pool: $COGNITO_USER_POOL_ID"
echo "  - Cognito Client ID: $COGNITO_CLIENT_ID"
echo "  - Frontend Environment: frontend/.env.production"
echo ""
echo "📖 Full deployment guide: PRODUCTION-DEPLOYMENT.md"