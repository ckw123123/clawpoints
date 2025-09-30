# AI Chatbot Setup Guide

This guide covers setting up the AI chatbot with Amazon Lex and social media integrations.

## 1. Amazon Lex Bot Setup

### Deploy Lex Infrastructure
```bash
cd infrastructure
aws cloudformation deploy \
  --template-file lex-bot-setup.yml \
  --stack-name membership-lex-bot \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides LambdaFunctionArn=arn:aws:lambda:us-east-1:YOUR_ACCOUNT:function:membership-points-api-dev-lexFulfillment
```

### Configure Lex Bot
1. Go to Amazon Lex Console
2. Find your "MembershipPointsBot"
3. Build the bot for both locales (en_US and zh_HK)
4. Test the bot with sample utterances

### Sample Test Utterances
**English:**
- "How many points do I have?"
- "What can I redeem?"
- "When do points expire?"

**Cantonese:**
- "我有幾多積分？"
- "有咩獎品可以換？"
- "積分幾時過期？"

## 2. WhatsApp Integration (Twilio)

### Prerequisites
1. Twilio Account
2. WhatsApp Business Account approved by Twilio
3. Verified phone numbers

### Setup Steps

1. **Create Twilio WhatsApp Sandbox**
   ```bash
   # Get your Twilio credentials
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   ```

2. **Configure Webhook URL**
   - Webhook URL: `https://your-api-gateway-url/webhooks/whatsapp`
   - HTTP Method: POST

3. **Environment Variables**
   ```bash
   export TWILIO_AUTH_TOKEN=your_twilio_auth_token
   ```

4. **Test WhatsApp Integration**
   - Send "join [sandbox-name]" to your Twilio WhatsApp number
   - Send test messages like "我有幾多積分？"

### WhatsApp Message Flow
```
User sends message → Twilio → API Gateway → Lambda → DynamoDB → Response
```

## 3. Instagram Integration (Facebook Graph API)

### Prerequisites
1. Facebook Developer Account
2. Instagram Business Account
3. Facebook App with Instagram Basic Display API

### Setup Steps

1. **Create Facebook App**
   - Go to Facebook Developers
   - Create new app
   - Add Instagram Basic Display product

2. **Configure Webhooks**
   - Webhook URL: `https://your-api-gateway-url/webhooks/instagram`
   - Verify Token: Set in environment variables
   - Subscribe to `messages` events

3. **Environment Variables**
   ```bash
   export INSTAGRAM_VERIFY_TOKEN=your_verify_token
   export INSTAGRAM_ACCESS_TOKEN=your_page_access_token
   ```

4. **Webhook Verification**
   ```bash
   curl -X GET "https://your-api-gateway-url/webhooks/instagram?hub.verify_token=your_verify_token&hub.challenge=test&hub.mode=subscribe"
   ```

### Instagram Message Flow
```
User sends DM → Facebook → Webhook → Lambda → Response via Graph API
```

## 4. Supported Intents and Responses

### CheckPointsIntent
**Triggers:**
- "How many points do I have?"
- "我有幾多積分？"
- "Check my balance"
- "查詢積分"

**Response:**
- Returns current points balance from DynamoDB
- Requires user authentication

### RedeemIntent
**Triggers:**
- "What can I redeem?"
- "有咩獎品可以換？"
- "Show me prizes"
- "可兌換獎品"

**Response:**
- Lists available prizes with points cost
- Shows stock availability

### FAQIntent
**Triggers:**
- "When do points expire?"
- "積分幾時過期？"
- "How do I earn points?"
- "點樣賺積分？"

**Responses:**
- Points expiry: "Points never expire!"
- Earning points: "Purchase items to earn points"
- Using points: "Redeem at any branch location"

## 5. Language Support

### Automatic Language Detection
The bot automatically detects language based on:
- Chinese characters (switches to Cantonese)
- Latin characters (switches to English)

### Supported Languages
- **English (en_US)**: Full support
- **Cantonese (zh_HK)**: Full support with traditional characters

## 6. Testing the Chatbot

### In-App Testing
1. Open the mobile app
2. Go to Profile page
3. Click "智能客服" button
4. Test with various queries

### API Testing
```bash
# Test webhook directly
curl -X POST https://your-api-gateway-url/lex/webhook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{
    "message": "我有幾多積分？",
    "userId": "user-uuid"
  }'
```

### WhatsApp Testing
1. Join Twilio sandbox
2. Send messages to test number
3. Verify responses in both languages

## 7. Monitoring and Logs

### CloudWatch Logs
- Lambda function logs: `/aws/lambda/membership-points-api-dev-lexFulfillment`
- API Gateway logs: Enable in API Gateway settings

### Lex Analytics
- Go to Lex Console → Analytics
- Monitor conversation metrics
- Track intent recognition accuracy

## 8. Troubleshooting

### Common Issues

1. **Lex Bot Not Responding**
   - Check Lambda function permissions
   - Verify bot is built and published
   - Check CloudWatch logs

2. **Language Detection Issues**
   - Verify Unicode support in Lambda
   - Check character encoding in requests

3. **WhatsApp Integration Fails**
   - Verify Twilio webhook URL
   - Check authentication tokens
   - Ensure HTTPS endpoint

4. **Instagram Webhook Not Working**
   - Verify Facebook app permissions
   - Check webhook verification token
   - Ensure proper SSL certificate

### Debug Commands
```bash
# Check Lambda logs
aws logs tail /aws/lambda/membership-points-api-dev-lexFulfillment --follow

# Test Lex bot directly
aws lexv2-runtime recognize-text \
  --bot-id YOUR_BOT_ID \
  --bot-alias-id YOUR_ALIAS_ID \
  --locale-id en_US \
  --session-id test-session \
  --text "How many points do I have?"
```

## 9. Security Considerations

### Authentication
- In-app: Uses Cognito JWT tokens
- WhatsApp: Phone number verification
- Instagram: Facebook app verification

### Data Privacy
- No personal data stored in chat logs
- User identification through secure tokens
- GDPR compliant data handling

### Rate Limiting
- Implement rate limiting for webhook endpoints
- Monitor for abuse patterns
- Set up CloudWatch alarms

## 10. Deployment Checklist

- [ ] Deploy Lex bot infrastructure
- [ ] Build and test Lex bot
- [ ] Deploy Lambda functions
- [ ] Configure Twilio WhatsApp sandbox
- [ ] Set up Facebook Instagram app
- [ ] Configure environment variables
- [ ] Test all integrations
- [ ] Monitor CloudWatch logs
- [ ] Set up alerts and monitoring

## Support

For additional help:
1. Check CloudWatch logs for errors
2. Test individual components separately
3. Verify all environment variables are set
4. Ensure proper IAM permissions
5. Contact AWS Support for Lex-specific issues