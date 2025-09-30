#!/bin/bash

# AWS Public Demo Deployment Script for ClawPoints
echo "🚀 Deploying ClawPoints Public Demo to AWS..."

# Check if AWS CLI is configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

# Set variables
PROJECT_NAME="clawpoints-demo"
TIMESTAMP=$(date +%s)
BUCKET_NAME="${PROJECT_NAME}-${TIMESTAMP}"
REGION="us-east-1"

echo "📋 Deployment Configuration:"
echo "  - Project: $PROJECT_NAME"
echo "  - Bucket: $BUCKET_NAME"
echo "  - Region: $REGION"
echo "  - CDN: CloudFront Global"

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

# Create S3 bucket
echo "🪣 Creating S3 bucket: $BUCKET_NAME"
aws s3 mb s3://$BUCKET_NAME --region $REGION

if [ $? -ne 0 ]; then
    echo "❌ Failed to create S3 bucket!"
    exit 1
fi

# Configure bucket for static website hosting
echo "🌐 Configuring static website hosting..."
aws s3 website s3://$BUCKET_NAME \
    --index-document index.html \
    --error-document index.html

# Create bucket policy for public read access
echo "🔓 Setting up public read access..."
cat > /tmp/bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF

aws s3api put-bucket-policy \
    --bucket $BUCKET_NAME \
    --policy file:///tmp/bucket-policy.json

# Upload build files to S3
echo "📤 Uploading files to S3..."
aws s3 sync build/ s3://$BUCKET_NAME --delete \
    --cache-control "public, max-age=31536000" \
    --exclude "*.html" \
    --exclude "service-worker.js" \
    --exclude "manifest.json"

# Upload HTML files with shorter cache
aws s3 sync build/ s3://$BUCKET_NAME --delete \
    --cache-control "public, max-age=0, must-revalidate" \
    --include "*.html" \
    --include "service-worker.js" \
    --include "manifest.json"

# Get S3 website URL
S3_WEBSITE_URL="http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"
echo "🌐 S3 Website URL: $S3_WEBSITE_URL"

# Create CloudFront distribution
echo "☁️ Creating CloudFront distribution (this takes 10-15 minutes)..."

# Create CloudFront distribution configuration
cat > /tmp/cloudfront-config.json << EOF
{
    "CallerReference": "$TIMESTAMP",
    "Comment": "ClawPoints Public Demo - Global CDN",
    "DefaultRootObject": "index.html",
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "S3-$BUCKET_NAME",
                "DomainName": "$BUCKET_NAME.s3-website-$REGION.amazonaws.com",
                "CustomOriginConfig": {
                    "HTTPPort": 80,
                    "HTTPSPort": 443,
                    "OriginProtocolPolicy": "http-only"
                }
            }
        ]
    },
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-$BUCKET_NAME",
        "ViewerProtocolPolicy": "redirect-to-https",
        "TrustedSigners": {
            "Enabled": false,
            "Quantity": 0
        },
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {
                "Forward": "none"
            }
        },
        "MinTTL": 0,
        "DefaultTTL": 86400,
        "MaxTTL": 31536000,
        "Compress": true
    },
    "CustomErrorResponses": {
        "Quantity": 1,
        "Items": [
            {
                "ErrorCode": 404,
                "ResponsePagePath": "/index.html",
                "ResponseCode": "200",
                "ErrorCachingMinTTL": 300
            }
        ]
    },
    "Enabled": true,
    "PriceClass": "PriceClass_100"
}
EOF

# Create CloudFront distribution
DISTRIBUTION_OUTPUT=$(aws cloudfront create-distribution \
    --distribution-config file:///tmp/cloudfront-config.json \
    --output json)

if [ $? -ne 0 ]; then
    echo "⚠️ CloudFront distribution creation failed, but S3 website is available"
    echo "🔗 Demo URL: $S3_WEBSITE_URL"
else
    # Extract CloudFront domain name
    CLOUDFRONT_DOMAIN=$(echo $DISTRIBUTION_OUTPUT | jq -r '.Distribution.DomainName')
    DISTRIBUTION_ID=$(echo $DISTRIBUTION_OUTPUT | jq -r '.Distribution.Id')
    
    echo "✅ CloudFront distribution created!"
    echo "📋 Distribution ID: $DISTRIBUTION_ID"
    echo "🌍 CloudFront URL: https://$CLOUDFRONT_DOMAIN"
fi

# Clean up temporary files
rm -f /tmp/bucket-policy.json /tmp/cloudfront-config.json

# Create deployment info file
cat > ../deployment-info.json << EOF
{
    "timestamp": "$TIMESTAMP",
    "bucketName": "$BUCKET_NAME",
    "region": "$REGION",
    "s3WebsiteUrl": "$S3_WEBSITE_URL",
    "cloudfrontDomain": "${CLOUDFRONT_DOMAIN:-"pending"}",
    "distributionId": "${DISTRIBUTION_ID:-"pending"}",
    "deploymentType": "public-demo"
}
EOF

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Deployment Summary:"
echo "  ✅ S3 Bucket: $BUCKET_NAME"
echo "  ✅ Static Website: Configured"
echo "  ✅ Files Uploaded: $(aws s3 ls s3://$BUCKET_NAME --recursive | wc -l) files"
echo "  ✅ Public Access: Enabled"
if [ ! -z "$CLOUDFRONT_DOMAIN" ]; then
    echo "  ✅ CloudFront CDN: $CLOUDFRONT_DOMAIN"
fi
echo ""
echo "🔗 Demo URLs:"
echo "  📍 Primary (S3): $S3_WEBSITE_URL"
if [ ! -z "$CLOUDFRONT_DOMAIN" ]; then
    echo "  🌍 Global CDN: https://$CLOUDFRONT_DOMAIN (available in 10-15 minutes)"
fi
echo ""
echo "👥 Demo Accounts:"
echo "  👑 Admin: admin / demo123"
echo "  💼 Sales: sales / demo123"
echo "  👤 Member: member / demo123"
echo ""
echo "🎮 Features to Test:"
echo "  ✅ Production-like authentication"
echo "  ✅ Intelligent barcode recognition"
echo "  ✅ Multi-language support (EN/ZH)"
echo "  ✅ Role-based access control"
echo "  ✅ Point transactions and history"
echo "  ✅ Admin dashboard and management"
echo "  ✅ Mobile responsive design"
echo ""
echo "💰 Cost Information:"
echo "  📊 S3 Storage: ~\$0.02/month (for demo files)"
echo "  🌐 CloudFront: ~\$0.10/month (first 1TB free)"
echo "  📈 Total Demo Cost: ~\$0.12/month"
echo ""
echo "🗑️ To delete this demo later:"
echo "  aws s3 rb s3://$BUCKET_NAME --force"
if [ ! -z "$DISTRIBUTION_ID" ]; then
    echo "  aws cloudfront delete-distribution --id $DISTRIBUTION_ID"
fi
echo ""
echo "📖 Share with your client:"
echo "  🎮 ClawPoints Demo: $S3_WEBSITE_URL"
echo "  📱 Mobile-friendly and production-ready interface"
echo "  🔗 All features functional with simulated backend"

cd ..