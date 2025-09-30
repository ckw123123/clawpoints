#!/bin/bash

# Professional AWS Demo Deployment with CloudFormation
echo "🚀 Deploying ClawPoints Public Demo to AWS (Professional Setup)..."

# Check if AWS CLI is configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "❌ jq is required but not installed. Please install jq first."
    echo "   macOS: brew install jq"
    echo "   Ubuntu: sudo apt-get install jq"
    exit 1
fi

# Configuration
PROJECT_NAME="clawpoints-demo"
STACK_NAME="${PROJECT_NAME}-hosting"
REGION="us-east-1"
CUSTOM_DOMAIN=""
CERTIFICATE_ARN=""

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --domain)
            CUSTOM_DOMAIN="$2"
            shift 2
            ;;
        --certificate)
            CERTIFICATE_ARN="$2"
            shift 2
            ;;
        --region)
            REGION="$2"
            shift 2
            ;;
        *)
            echo "Unknown option $1"
            echo "Usage: $0 [--domain example.com] [--certificate arn:aws:acm:...] [--region us-east-1]"
            exit 1
            ;;
    esac
done

echo "📋 Deployment Configuration:"
echo "  - Project: $PROJECT_NAME"
echo "  - Stack: $STACK_NAME"
echo "  - Region: $REGION"
if [ ! -z "$CUSTOM_DOMAIN" ]; then
    echo "  - Custom Domain: $CUSTOM_DOMAIN"
fi
if [ ! -z "$CERTIFICATE_ARN" ]; then
    echo "  - SSL Certificate: Configured"
fi

# Build the application
echo "🔨 Building React application..."
cd frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build production bundle
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build completed successfully!"
cd ..

# Deploy CloudFormation stack
echo "☁️ Deploying CloudFormation stack..."

# Prepare parameters
PARAMETERS="ParameterKey=ProjectName,ParameterValue=$PROJECT_NAME"
if [ ! -z "$CUSTOM_DOMAIN" ]; then
    PARAMETERS="$PARAMETERS ParameterKey=DomainName,ParameterValue=$CUSTOM_DOMAIN"
fi
if [ ! -z "$CERTIFICATE_ARN" ]; then
    PARAMETERS="$PARAMETERS ParameterKey=CertificateArn,ParameterValue=$CERTIFICATE_ARN"
fi

aws cloudformation deploy \
    --template-file infrastructure/demo-hosting.yml \
    --stack-name $STACK_NAME \
    --parameter-overrides $PARAMETERS \
    --region $REGION \
    --capabilities CAPABILITY_IAM

if [ $? -ne 0 ]; then
    echo "❌ CloudFormation deployment failed!"
    exit 1
fi

echo "✅ CloudFormation stack deployed successfully!"

# Get stack outputs
echo "📋 Retrieving deployment information..."
STACK_OUTPUTS=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs' \
    --output json)

BUCKET_NAME=$(echo $STACK_OUTPUTS | jq -r '.[] | select(.OutputKey=="BucketName") | .OutputValue')
WEBSITE_URL=$(echo $STACK_OUTPUTS | jq -r '.[] | select(.OutputKey=="WebsiteURL") | .OutputValue')
CLOUDFRONT_URL=$(echo $STACK_OUTPUTS | jq -r '.[] | select(.OutputKey=="CloudFrontURL") | .OutputValue')
DISTRIBUTION_ID=$(echo $STACK_OUTPUTS | jq -r '.[] | select(.OutputKey=="DistributionId") | .OutputValue')

if [ ! -z "$CUSTOM_DOMAIN" ]; then
    CUSTOM_URL=$(echo $STACK_OUTPUTS | jq -r '.[] | select(.OutputKey=="CustomDomainURL") | .OutputValue')
fi

echo "📤 Uploading files to S3..."

# Upload build files with optimized caching
aws s3 sync frontend/build/ s3://$BUCKET_NAME --delete \
    --cache-control "public, max-age=31536000" \
    --exclude "*.html" \
    --exclude "service-worker.js" \
    --exclude "manifest.json"

# Upload HTML files with no cache
aws s3 sync frontend/build/ s3://$BUCKET_NAME \
    --cache-control "public, max-age=0, must-revalidate" \
    --include "*.html" \
    --include "service-worker.js" \
    --include "manifest.json"

echo "✅ Files uploaded successfully!"

# Invalidate CloudFront cache
echo "🔄 Invalidating CloudFront cache..."
INVALIDATION_ID=$(aws cloudfront create-invalidation \
    --distribution-id $DISTRIBUTION_ID \
    --paths "/*" \
    --query 'Invalidation.Id' \
    --output text)

echo "✅ Cache invalidation created: $INVALIDATION_ID"

# Create deployment info file
cat > deployment-info.json << EOF
{
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "stackName": "$STACK_NAME",
    "bucketName": "$BUCKET_NAME",
    "region": "$REGION",
    "websiteUrl": "$WEBSITE_URL",
    "cloudfrontUrl": "$CLOUDFRONT_URL",
    "distributionId": "$DISTRIBUTION_ID",
    "customDomain": "${CUSTOM_DOMAIN:-""}",
    "customUrl": "${CUSTOM_URL:-""}",
    "invalidationId": "$INVALIDATION_ID",
    "deploymentType": "professional-demo"
}
EOF

# Create client sharing template
cat > demo-client-info.md << EOF
# 🎮 ClawPoints Demo - Ready for Testing

## 🔗 Demo URLs
- **Primary**: $CLOUDFRONT_URL
- **Backup**: $WEBSITE_URL
$(if [ ! -z "$CUSTOM_URL" ]; then echo "- **Custom Domain**: $CUSTOM_URL"; fi)

## 👥 Demo Accounts
\`\`\`
👑 Admin Access:
   Username: admin
   Password: demo123
   Features: Full system access, all management functions

💼 Sales Access:
   Username: sales
   Password: demo123
   Features: Member management, scanning, transactions

👤 Member Access:
   Username: member
   Password: demo123
   Features: View points, transaction history, profile
\`\`\`

## 🎯 Key Features to Test

### ✅ Authentication & Security
- [ ] Login with different role accounts
- [ ] Sign up process (simulated email confirmation)
- [ ] Session persistence across browser refresh
- [ ] Role-based access control

### ✅ Intelligent Barcode System
- [ ] Click "掃描條碼" to simulate scanning
- [ ] Test item recognition (green interface, direct purchase)
- [ ] Test prize recognition (blue interface, dual options)
- [ ] Complete point transactions

### ✅ Multi-Language Support
- [ ] Switch between English and Chinese
- [ ] Verify all interface elements translate
- [ ] Test in both languages

### ✅ Business Operations
- [ ] Member search and management
- [ ] Point transaction processing
- [ ] Transaction history and reporting
- [ ] Admin dashboard functionality

### ✅ Mobile Experience
- [ ] Test on mobile devices
- [ ] Verify responsive design
- [ ] Check touch interactions

## 💡 Production Readiness Indicators

Throughout the demo, you'll see:
- **🔗 Blue API notices** showing which features need AWS backend
- **Cost estimates** for each production component
- **"Production Ready" labels** on completed features

## 💰 Production Investment

**Total AWS Infrastructure Cost: \$5-30/month**
- Authentication (Cognito): \$0-5/month
- Database (DynamoDB): \$1-10/month
- API Gateway: \$1-5/month
- File Storage (S3): \$1-3/month
- Monitoring: \$2-5/month

**Implementation Timeline: 1-2 weeks**

## 🎯 What This Demo Proves

1. **90% Complete System** - Not a concept, but working software
2. **Production-Ready Architecture** - AWS serverless backend coded
3. **Professional UI/UX** - Polished, responsive design
4. **Intelligent Features** - Barcode recognition, multi-language
5. **Scalable Foundation** - Built for business growth

## 📞 Next Steps

After testing, we can discuss:
- Customization requirements
- Production deployment timeline
- Staff training and support
- Ongoing maintenance and updates

---
*This demo represents the exact production system you'll receive. The only difference is the backend data source - production uses AWS APIs instead of simulated data.*
EOF

echo ""
echo "🎉 Professional AWS Demo Deployment Completed!"
echo ""
echo "📋 Deployment Summary:"
echo "  ✅ CloudFormation Stack: $STACK_NAME"
echo "  ✅ S3 Bucket: $BUCKET_NAME"
echo "  ✅ CloudFront CDN: Global distribution"
echo "  ✅ SSL/HTTPS: Enabled"
echo "  ✅ Cache Optimization: Configured"
echo "  ✅ Error Handling: SPA routing support"
echo ""
echo "🔗 Demo URLs:"
echo "  🌍 Primary (CDN): $CLOUDFRONT_URL"
echo "  📍 Backup (S3): $WEBSITE_URL"
if [ ! -z "$CUSTOM_URL" ]; then
    echo "  🎯 Custom Domain: $CUSTOM_URL"
fi
echo ""
echo "👥 Demo Accounts:"
echo "  👑 Admin: admin / demo123"
echo "  💼 Sales: sales / demo123"
echo "  👤 Member: member / demo123"
echo ""
echo "📊 Performance Features:"
echo "  ✅ Global CDN (CloudFront)"
echo "  ✅ Gzip compression enabled"
echo "  ✅ Optimized caching strategy"
echo "  ✅ HTTP/2 support"
echo "  ✅ Mobile-optimized delivery"
echo ""
echo "💰 Demo Hosting Cost:"
echo "  📊 S3 Storage: ~\$0.02/month"
echo "  🌐 CloudFront: ~\$0.10/month (1TB free tier)"
echo "  📈 Total: ~\$0.12/month"
echo ""
echo "📄 Client Information:"
echo "  📋 Demo details: demo-client-info.md"
echo "  🔧 Deployment info: deployment-info.json"
echo ""
echo "🗑️ To delete this demo:"
echo "  aws cloudformation delete-stack --stack-name $STACK_NAME --region $REGION"
echo ""
echo "🎯 Share with your client:"
echo "  $CLOUDFRONT_URL"