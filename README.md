# ClawPoints 爪爪積分

**Play, Earn, Redeem with AI （玩樂、積分、AI 智能換獎）**

A comprehensive AI-powered membership points management system built with AWS services, React, and Tailwind CSS.

## Features

### User Features
- **Authentication**: Username/password login via Amazon Cognito
- **QR Code**: Personal QR code for point transactions
- **Points Tracking**: View current points balance and transaction history
- **Profile Management**: Update personal information and change password
- **PWA Support**: Install as mobile app

### Admin Features
- **QR Scanner**: Scan user QR codes and item barcodes
- **Point Management**: Add/redeem points for members
- **Member Search**: Find members by name or username
- **Prize Management**: Update prize stock and pricing
- **Branch Selection**: Manage multiple branch locations

### AI Chatbot Features (Owner Controlled)
- **Owner Control**: Admin can enable/disable chatbot functionality
- **Multilingual Support**: Cantonese and English language detection
- **Smart Intents**: Check points, browse prizes, FAQ responses
- **In-App Chat**: Integrated chat widget in Profile page (when enabled)
- **Social Integration**: Optional WhatsApp and Instagram DM support
- **Real-time Responses**: Instant answers to common queries
- **Default State**: Chatbot is OFF by default

## Architecture

### Frontend
- **React 18** with functional components and hooks
- **Tailwind CSS** for responsive design
- **AWS Amplify** for authentication and API calls
- **QR Code generation** for member identification
- **PWA capabilities** for mobile installation

### Backend
- **AWS Lambda** serverless functions
- **Amazon DynamoDB** for data storage
- **Amazon Cognito** for user authentication
- **API Gateway** for REST API endpoints
- **Amazon Lex** for AI chatbot with NLP
- **Serverless Framework** for deployment

### Database Schema

#### Users Table
- `id` (UUID, Primary Key)
- `login_name` (String, Unique)
- `password_hash` (String)
- `name` (String)
- `gender` (String)
- `birthday` (Date)
- `points` (Integer, default: 0)
- `branch_id` (UUID, FK)

#### Transactions Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, FK)
- `type` (Enum: add, redeem)
- `item_name` (String)
- `points` (Integer)
- `branch_id` (UUID, FK)
- `created_at` (Timestamp)

#### Items Table
- `id` (UUID, Primary Key)
- `name` (String)
- `barcode` (String)
- `points_value` (Integer)

#### Prizes Table
- `id` (UUID, Primary Key)
- `name` (String)
- `cost_points` (Integer)
- `stock` (Integer)
- `branch_id` (UUID, FK)

#### Branches Table
- `id` (UUID, Primary Key)
- `name` (String)
- `location` (String)

#### Settings Table
- `key` (String, Primary Key)
- `value` (Boolean/String)
- `description` (String)
- `updated_at` (Timestamp)

## Setup Instructions

### Prerequisites
- Node.js 18+
- AWS CLI configured
- AWS Account with appropriate permissions

### 1. Install Dependencies
```bash
npm run install-all
```

### 2. Deploy Cognito Infrastructure
```bash
cd infrastructure
aws cloudformation deploy --template-file cognito-setup.yml --stack-name membership-cognito --capabilities CAPABILITY_IAM
```

### 3. Deploy Backend
```bash
cd backend
npm install -g serverless
serverless deploy
```

### 4. Deploy Lex Chatbot
```bash
cd infrastructure
aws cloudformation deploy --template-file lex-bot-setup.yml --stack-name membership-lex-bot --capabilities CAPABILITY_IAM
```

### 5. Seed Sample Data
```bash
cd scripts
node seed-data.js
```

### 6. Configure Frontend
Update `frontend/src/aws-exports.js` with your actual AWS resource IDs:
- Cognito User Pool ID
- Cognito Client ID
- API Gateway endpoint

### 7. Run Frontend
```bash
cd frontend
npm start
```

## AI Chatbot Setup

### Owner Control
- **Admin Dashboard**: Go to Settings tab to enable/disable chatbot
- **Default State**: Chatbot is OFF by default
- **User Experience**: Chatbot button only appears when enabled
- **Social Integration**: Separate toggles for WhatsApp and Instagram

### Supported Intents
1. **CheckPointsIntent**: "我有幾多點？" / "How many points do I have?"
2. **RedeemIntent**: "點數可以換咩？" / "What can I redeem?"
3. **FAQIntent**: "點數幾時過期？" / "When do points expire?"

### Social Media Integration
- **WhatsApp**: Via Twilio API (optional)
- **Instagram**: Via Facebook Graph API (optional)
- **Language Support**: Automatic Cantonese/English detection

### Enabling the Chatbot
1. Login as admin user
2. Go to Admin Dashboard → Settings tab
3. Toggle "AI Chatbot" to ON
4. Users will now see the "智能客服" button in Profile page

For detailed setup instructions, see [docs/chatbot-setup.md](docs/chatbot-setup.md)

## Deployment

### Backend Deployment
```bash
cd backend
serverless deploy --stage prod
```

### Frontend Deployment (AWS Amplify)
1. Connect your repository to AWS Amplify
2. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - cd frontend
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: frontend/build
       files:
         - '**/*'
   ```

## API Endpoints

### User Management
- `GET /users/{id}` - Get user profile
- `PUT /users/{id}` - Update user profile
- `GET /members/search` - Search members (admin)

### Transactions
- `GET /users/{id}/transactions` - Get user transaction history
- `POST /transactions` - Create new transaction (admin)

### Branches
- `GET /branches` - List all branches

### Prizes
- `GET /prizes` - List all prizes
- `PUT /prizes/{id}` - Update prize (admin)

### Items
- `GET /items` - List all items

### Settings
- `GET /settings` - Get system settings
- `PUT /settings` - Update system settings (admin only)

## Security

### Authentication
- Amazon Cognito User Pools for user authentication
- JWT tokens for API authorization
- Role-based access control (admin group)

### Authorization
- API Gateway with Cognito authorizer
- Lambda functions validate user permissions
- Admin-only endpoints protected by group membership

## Mobile PWA Features

### Installation
- Add to home screen capability
- Offline-ready service worker
- App-like experience on mobile devices

### Responsive Design
- Mobile-first design approach
- Touch-friendly interface
- Bottom navigation for easy thumb access

## Admin Features

### QR Code Scanner
- Scan member QR codes for transactions
- Scan item barcodes for point addition
- Real-time camera integration

### Member Management
- Search members by name/username
- View member transaction history
- Process point transactions

### Prize Management
- Update prize stock levels
- Modify point costs
- Branch-specific prize management

## Development

### Local Development
```bash
# Start backend locally
cd backend
serverless offline

# Start frontend
cd frontend
npm start
```

### Testing
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Environment Variables

### Backend (.env)
```
COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
AWS_REGION=us-east-1
```

### Frontend
Update `aws-exports.js` with your AWS resource configurations.

## Troubleshooting

### Common Issues

1. **Cognito Authentication Errors**
   - Verify User Pool and Client IDs
   - Check aws-exports.js configuration
   - Ensure proper IAM permissions

2. **API Gateway CORS Issues**
   - Verify CORS settings in serverless.yml
   - Check API Gateway configuration

3. **DynamoDB Access Errors**
   - Verify IAM role permissions
   - Check table names in environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.