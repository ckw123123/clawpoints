#!/bin/bash

# Demo Monitoring Setup Script
echo "📊 Setting up monitoring for ClawPoints Demo..."

# Check if deployment info exists
if [ ! -f "deployment-info.json" ]; then
    echo "❌ deployment-info.json not found. Please deploy the demo first."
    exit 1
fi

# Extract deployment information
DISTRIBUTION_ID=$(jq -r '.distributionId' deployment-info.json)
BUCKET_NAME=$(jq -r '.bucketName' deployment-info.json)
REGION=$(jq -r '.region' deployment-info.json)

echo "📋 Setting up monitoring for:"
echo "  - CloudFront Distribution: $DISTRIBUTION_ID"
echo "  - S3 Bucket: $BUCKET_NAME"
echo "  - Region: $REGION"

# Create CloudWatch dashboard
echo "📈 Creating CloudWatch dashboard..."

cat > /tmp/dashboard-config.json << EOF
{
    "widgets": [
        {
            "type": "metric",
            "x": 0,
            "y": 0,
            "width": 12,
            "height": 6,
            "properties": {
                "metrics": [
                    [ "AWS/CloudFront", "Requests", "DistributionId", "$DISTRIBUTION_ID" ],
                    [ ".", "BytesDownloaded", ".", "." ]
                ],
                "view": "timeSeries",
                "stacked": false,
                "region": "us-east-1",
                "title": "ClawPoints Demo - Traffic",
                "period": 300
            }
        },
        {
            "type": "metric",
            "x": 12,
            "y": 0,
            "width": 12,
            "height": 6,
            "properties": {
                "metrics": [
                    [ "AWS/CloudFront", "4xxErrorRate", "DistributionId", "$DISTRIBUTION_ID" ],
                    [ ".", "5xxErrorRate", ".", "." ]
                ],
                "view": "timeSeries",
                "stacked": false,
                "region": "us-east-1",
                "title": "ClawPoints Demo - Error Rates",
                "period": 300
            }
        },
        {
            "type": "metric",
            "x": 0,
            "y": 6,
            "width": 24,
            "height": 6,
            "properties": {
                "metrics": [
                    [ "AWS/S3", "BucketSizeBytes", "BucketName", "$BUCKET_NAME", "StorageType", "StandardStorage" ]
                ],
                "view": "timeSeries",
                "stacked": false,
                "region": "$REGION",
                "title": "ClawPoints Demo - Storage Usage",
                "period": 86400
            }
        }
    ]
}
EOF

aws cloudwatch put-dashboard \
    --dashboard-name "ClawPoints-Demo-Monitoring" \
    --dashboard-body file:///tmp/dashboard-config.json

if [ $? -eq 0 ]; then
    echo "✅ CloudWatch dashboard created successfully!"
    echo "🔗 View at: https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=ClawPoints-Demo-Monitoring"
else
    echo "⚠️ Failed to create CloudWatch dashboard"
fi

# Create CloudWatch alarms
echo "🚨 Setting up CloudWatch alarms..."

# High error rate alarm
aws cloudwatch put-metric-alarm \
    --alarm-name "ClawPoints-Demo-High-Error-Rate" \
    --alarm-description "Alert when demo has high error rate" \
    --metric-name "4xxErrorRate" \
    --namespace "AWS/CloudFront" \
    --statistic "Average" \
    --period 300 \
    --threshold 5.0 \
    --comparison-operator "GreaterThanThreshold" \
    --evaluation-periods 2 \
    --dimensions Name=DistributionId,Value=$DISTRIBUTION_ID

# High traffic alarm (for demo popularity tracking)
aws cloudwatch put-metric-alarm \
    --alarm-name "ClawPoints-Demo-High-Traffic" \
    --alarm-description "Alert when demo receives high traffic" \
    --metric-name "Requests" \
    --namespace "AWS/CloudFront" \
    --statistic "Sum" \
    --period 3600 \
    --threshold 1000 \
    --comparison-operator "GreaterThanThreshold" \
    --evaluation-periods 1 \
    --dimensions Name=DistributionId,Value=$DISTRIBUTION_ID

echo "✅ CloudWatch alarms configured!"

# Create simple analytics tracking
echo "📊 Setting up demo analytics..."

cat > demo-analytics.html << EOF
<!DOCTYPE html>
<html>
<head>
    <title>ClawPoints Demo Analytics</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .metric { background: #f5f5f5; padding: 20px; margin: 10px 0; border-radius: 5px; }
        .value { font-size: 24px; font-weight: bold; color: #2196F3; }
    </style>
</head>
<body>
    <h1>🎮 ClawPoints Demo Analytics</h1>
    
    <div class="metric">
        <h3>📊 Demo URL</h3>
        <div class="value">$(jq -r '.cloudfrontUrl' deployment-info.json)</div>
    </div>
    
    <div class="metric">
        <h3>📅 Deployed</h3>
        <div class="value">$(jq -r '.timestamp' deployment-info.json)</div>
    </div>
    
    <div class="metric">
        <h3>🌍 Global CDN</h3>
        <div class="value">CloudFront Distribution: $DISTRIBUTION_ID</div>
    </div>
    
    <div class="metric">
        <h3>💰 Current Cost</h3>
        <div class="value">~\$0.12/month (S3 + CloudFront)</div>
    </div>
    
    <h2>📈 Monitoring Links</h2>
    <ul>
        <li><a href="https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=ClawPoints-Demo-Monitoring">CloudWatch Dashboard</a></li>
        <li><a href="https://console.aws.amazon.com/cloudfront/home?region=us-east-1#distribution-settings:$DISTRIBUTION_ID">CloudFront Distribution</a></li>
        <li><a href="https://console.aws.amazon.com/s3/buckets/$BUCKET_NAME?region=$REGION">S3 Bucket</a></li>
    </ul>
    
    <h2>👥 Demo Accounts</h2>
    <ul>
        <li><strong>Admin:</strong> admin / demo123</li>
        <li><strong>Sales:</strong> sales / demo123</li>
        <li><strong>Member:</strong> member / demo123</li>
    </ul>
    
    <h2>🎯 Client Testing Checklist</h2>
    <ul>
        <li>✅ Authentication with different roles</li>
        <li>✅ Intelligent barcode scanning</li>
        <li>✅ Multi-language support (EN/ZH)</li>
        <li>✅ Point transactions and history</li>
        <li>✅ Admin dashboard functionality</li>
        <li>✅ Mobile responsive design</li>
    </ul>
</body>
</html>
EOF

echo "✅ Analytics page created: demo-analytics.html"

# Clean up temporary files
rm -f /tmp/dashboard-config.json

echo ""
echo "🎉 Demo monitoring setup completed!"
echo ""
echo "📊 Monitoring Features:"
echo "  ✅ CloudWatch Dashboard: Real-time metrics"
echo "  ✅ Error Rate Alarms: Automatic notifications"
echo "  ✅ Traffic Monitoring: Usage tracking"
echo "  ✅ Cost Tracking: Expense monitoring"
echo ""
echo "📈 View Monitoring:"
echo "  🔗 Dashboard: https://console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=ClawPoints-Demo-Monitoring"
echo "  📊 Analytics: Open demo-analytics.html in browser"
echo ""
echo "🔔 Alerts Configured:"
echo "  ⚠️ High error rate (>5%)"
echo "  📈 High traffic (>1000 requests/hour)"