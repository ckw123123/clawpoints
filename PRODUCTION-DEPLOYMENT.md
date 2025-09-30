# 🚀 ClawPoints Production Deployment Guide

## Prerequisites

### 1. AWS Account Setup
```bash
# Install AWS CLI
brew install awscli  # macOS
# or
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"  # Linux

# Configure AWS credentials
aws configure
```

### 2. Node.js & Dependencies
```bash
# Install Node.js 18+
node --version  # Should be 18+
npm --version

# Install Serverless Framework
npm install -g serverless

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

## 🔧 Phase 1: Backend Infrastructure Deployment

### Step 1: Deploy Cognito User Pool
```bash
cd infrastructure
aws cloudformation deploy \
    --template-file cognito-setup.yml \
    --stack-name clawpoints-cognito-prod \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides \
        Environment=prod \
        AppName=ClawPoints
```

### Step 2: Get Cognito Configuration
```bash
# Get User Pool ID
COGNITO_USER_POOL_ID=$(aws cloudformation describe-stacks \
    --stack-name clawpoints-cognito-prod \
    --query 'Stacks[0].Outputs[?OutputKey==`UserPoolId`].OutputValue' \
    --output text)

# Get Client ID
COGNITO_CLIENT_ID=$(aws cloudformation describe-stacks \
    --stack-name clawpoints-cognito-prod \
    --query 'Stacks[0].Outputs[?OutputKey==`UserPoolClientId`].OutputValue' \
    --output text)

echo "User Pool ID: $COGNITO_USER_POOL_ID"
echo "Client ID: $COGNITO_CLIENT_ID"
```

### Step 3: Deploy Backend API
```bash
cd ../backend

# Set environment variables
export COGNITO_USER_POOL_ID=$COGNITO_USER_POOL_ID

# Deploy serverless stack
serverless deploy --stage prod --verbose

# Get API Gateway URL
API_URL=$(serverless info --stage prod --verbose | grep -o 'https://[^[:space:]]*')
echo "API URL: $API_URL"
```

### Step 4: Seed Initial Data
```bash
cd ../scripts
node seed-data.js --stage=prod --api-url=$API_URL
```

## 🌐 Phase 2: Frontend Production Build

### Step 1: Configure Environment
```bash
cd ../frontend

# Create production environment file
cat > .env.production << EOF
REACT_APP_API_URL=$API_URL
REACT_APP_COGNITO_USER_POOL_ID=$COGNITO_USER_POOL_ID
REACT_APP_COGNITO_CLIENT_ID=$COGNITO_CLIENT_ID
REACT_APP_STAGE=prod
REACT_APP_REGION=us-east-1
REACT_APP_ENABLE_CAMERA_SCANNING=true
REACT_APP_ENABLE_CHATBOT=true
EOF
```

### Step 2: Switch to Production App
```bash
# Backup current App.js
mv src/App.js src/App-demo.js

# Use production App.js
mv src/App-production.js src/App.js
```

### Step 3: Build Production Bundle
```bash
# Build optimized production bundle
npm run build

# Test build locally (optional)
npx serve -s build -l 3000
```

## ☁️ Phase 3: AWS Hosting Deployment

### Option A: S3 + CloudFront (Recommended)

#### Step 1: Create S3 Bucket
```bash
# Create unique bucket name
BUCKET_NAME="clawpoints-frontend-$(date +%s)"

# Create S3 bucket
aws s3 mb s3://$BUCKET_NAME --region us-east-1

# Configure bucket for static website hosting
aws s3 website s3://$BUCKET_NAME \
    --index-document index.html \
    --error-document index.html
```

#### Step 2: Upload Build Files
```bash
# Upload build files to S3
aws s3 sync build/ s3://$BUCKET_NAME --delete

# Set public read permissions
aws s3api put-bucket-policy \
    --bucket $BUCKET_NAME \
    --policy '{
        "Version": "2012-10-17",
        "Statement": [{
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::'$BUCKET_NAME'/*"
        }]
    }'
```

#### Step 3: Create CloudFront Distribution
```bash
# Create CloudFront distribution (this takes 10-15 minutes)
aws cloudfront create-distribution \
    --distribution-config '{
        "CallerReference": "'$(date +%s)'",
        "Comment": "ClawPoints Production Distribution",
        "DefaultRootObject": "index.html",
        "Origins": {
            "Quantity": 1,
            "Items": [{
                "Id": "S3-'$BUCKET_NAME'",
                "DomainName": "'$BUCKET_NAME'.s3.amazonaws.com",
                "S3OriginConfig": {
                    "OriginAccessIdentity": ""
                }
            }]
        },
        "DefaultCacheBehavior": {
            "TargetOriginId": "S3-'$BUCKET_NAME'",
            "ViewerProtocolPolicy": "redirect-to-https",
            "TrustedSigners": {
                "Enabled": false,
                "Quantity": 0
            },
            "ForwardedValues": {
                "QueryString": false,
                "Cookies": {"Forward": "none"}
            }
        },
        "Enabled": true,
        "PriceClass": "PriceClass_100"
    }'
```

### Option B: Amplify Hosting (Alternative)

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize Amplify project
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

## 🔐 Phase 4: Security & SSL

### Step 1: Request SSL Certificate
```bash
# Request certificate (must be in us-east-1 for CloudFront)
aws acm request-certificate \
    --domain-name yourdomain.com \
    --subject-alternative-names www.yourdomain.com \
    --validation-method DNS \
    --region us-east-1
```

### Step 2: Configure Custom Domain
```bash
# Update CloudFront distribution with custom domain
# (This requires manual configuration in AWS Console)
```

## 📊 Phase 5: Monitoring & Analytics

### Step 1: CloudWatch Alarms
```bash
# Create CloudWatch alarms for API Gateway
aws cloudwatch put-metric-alarm \
    --alarm-name "ClawPoints-API-Errors" \
    --alarm-description "API Gateway 4XX/5XX errors" \
    --metric-name 4XXError \
    --namespace AWS/ApiGateway \
    --statistic Sum \
    --period 300 \
    --threshold 10 \
    --comparison-operator GreaterThanThreshold
```

### Step 2: Enable AWS X-Ray (Optional)
```bash
# Enable X-Ray tracing in serverless.yml
# Add to provider section:
# tracing:
#   lambda: true
#   apiGateway: true
```

## 🧪 Phase 6: Testing Production

### Step 1: Create Test Users
```bash
# Create admin user
aws cognito-idp admin-create-user \
    --user-pool-id $COGNITO_USER_POOL_ID \
    --username admin \
    --user-attributes Name=email,Value=admin@yourdomain.com Name=name,Value="Admin User" \
    --temporary-password TempPass123! \
    --message-action SUPPRESS

# Set permanent password
aws cognito-idp admin-set-user-password \
    --user-pool-id $COGNITO_USER_POOL_ID \
    --username admin \
    --password AdminPass123! \
    --permanent
```

### Step 2: Test Core Functionality
1. **Authentication**: Login/logout, password reset
2. **Barcode Scanning**: Test item/prize recognition
3. **Point Transactions**: Add/redeem points
4. **Admin Functions**: CRUD operations
5. **Multi-language**: Switch between EN/ZH

## 🚀 Phase 7: Go Live Checklist

### Pre-Launch
- [ ] All environment variables configured
- [ ] SSL certificate installed
- [ ] Custom domain configured
- [ ] Test users created and verified
- [ ] Backup and monitoring configured
- [ ] Performance testing completed

### Launch Day
- [ ] DNS records updated
- [ ] CDN cache cleared
- [ ] Staff training completed
- [ ] Support documentation ready
- [ ] Monitoring dashboards active

### Post-Launch
- [ ] Monitor error rates and performance
- [ ] Collect user feedback
- [ ] Plan feature updates
- [ ] Schedule regular backups

## 📞 Support & Maintenance

### Daily Tasks
- Monitor CloudWatch dashboards
- Check error logs
- Verify backup completion

### Weekly Tasks
- Review performance metrics
- Update dependencies
- Test disaster recovery

### Monthly Tasks
- Security audit
- Cost optimization review
- Feature planning

## 🔧 Troubleshooting

### Common Issues

#### 1. CORS Errors
```bash
# Check API Gateway CORS configuration
# Ensure frontend domain is whitelisted
```

#### 2. Authentication Issues
```bash
# Verify Cognito configuration
aws cognito-idp describe-user-pool --user-pool-id $COGNITO_USER_POOL_ID
```

#### 3. Database Connection Issues
```bash
# Check DynamoDB table status
aws dynamodb describe-table --table-name membership-points-api-users-prod
```

#### 4. Performance Issues
```bash
# Check Lambda function metrics
aws logs describe-log-groups --log-group-name-prefix /aws/lambda/membership-points-api-prod
```

## 📈 Scaling Considerations

### Traffic Growth
- **DynamoDB**: Auto-scaling enabled by default
- **Lambda**: Concurrent execution limits
- **API Gateway**: Rate limiting configuration
- **CloudFront**: Global edge locations

### Cost Optimization
- **S3**: Lifecycle policies for old logs
- **Lambda**: Memory optimization
- **DynamoDB**: On-demand vs provisioned capacity
- **CloudWatch**: Log retention policies

---

## 🎉 Congratulations!

Your ClawPoints application is now live in production! 

**Next Steps:**
1. Monitor the application closely for the first 24-48 hours
2. Gather user feedback and iterate
3. Plan additional features and improvements
4. Set up automated deployment pipelines for future updates

For support, refer to the AWS documentation or contact your development team.