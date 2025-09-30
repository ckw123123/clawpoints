# 🚀 Membership Points App - Preview Guide

## Quick Preview (No AWS Setup Required)

### Option 1: Demo Mode (Recommended for Preview)

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start demo version:**
```bash
# Copy demo files
cp src/index-demo.js src/index.js
cp src/App-demo.js src/App.js
cp src/contexts/AuthContext-demo.js src/contexts/AuthContext.js
cp src/contexts/SettingsContext-demo.js src/contexts/SettingsContext.js

# Start the app
npm start
```

4. **Open browser:**
   - Go to `http://localhost:3000`
   - Choose "Login as Demo User" or "Login as Demo Admin"

### What You'll See:

#### 🏠 **Home Page**
- Personal QR code display
- Current points balance (1,250 for user, 5,000 for admin)
- Branch information
- Quick action cards

#### 📊 **Records Page**
- Transaction history with filters
- Points earned/redeemed summary
- Beautiful transaction cards with timestamps

#### 👤 **Profile Page**
- Personal information form
- Password change functionality
- **AI Chatbot section** (only visible when enabled by admin)

#### ⚙️ **Admin Dashboard** (Admin only)
- **Scanner Tab**: QR code scanner interface
- **Members Tab**: Member search functionality
- **Prizes Tab**: Prize management with stock updates
- **Items Tab**: Item catalog with point values
- **Settings Tab**: 🎛️ **Owner control toggles**
  - AI Chatbot: ON/OFF toggle
  - WhatsApp Integration: ON/OFF toggle
  - Instagram Integration: ON/OFF toggle

## 🎯 Key Features to Test

### 1. **Owner Control Demo**
1. Login as "Demo Admin"
2. Go to Admin Dashboard → Settings tab
3. Toggle "AI Chatbot" to ON
4. Switch to "Demo User" (refresh page)
5. Go to Profile page → See "智能客服" button appear!

### 2. **Chatbot Interface**
- Click "智能客服" button (when enabled)
- Try sample messages:
  - "我有幾多積分？" (Cantonese)
  - "How many points do I have?" (English)
  - "What can I redeem?"
- Language toggle (中/EN)
- Quick action buttons

### 3. **Mobile Responsive**
- Resize browser window
- Test bottom navigation
- Full-screen chatbot on mobile

### 4. **Admin Features**
- Prize stock management
- Member search (mock data)
- Settings control panel

## 📱 Mobile Preview

### Chrome DevTools:
1. Press F12
2. Click device toggle icon
3. Select iPhone/Android device
4. Test mobile interface

### Features to Test:
- Bottom navigation tabs
- Full-screen chatbot modal
- Touch-friendly buttons
- Responsive layouts

## 🎨 UI/UX Highlights

### Design System:
- **Primary Color**: Blue (#3b82f6)
- **Success**: Green for chatbot
- **Clean Cards**: White backgrounds with subtle shadows
- **Icons**: Emoji-based for universal appeal

### Interactions:
- **Smooth Animations**: Loading states, transitions
- **Feedback**: Success/error messages
- **Progressive Disclosure**: Settings only for admins

## 🔧 Customization Options

### Colors (in `tailwind.config.js`):
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#3b82f6', // Change this for different brand color
        600: '#2563eb',
        700: '#1d4ed8',
      }
    }
  }
}
```

### Features to Modify:
- Add more chatbot intents
- Customize prize categories
- Add branch-specific features
- Modify point earning rules

## 🚀 Full Deployment Preview

### If you want to test with real AWS services:

1. **Deploy Backend:**
```bash
cd backend
npm install
serverless deploy
```

2. **Deploy Cognito:**
```bash
cd infrastructure
aws cloudformation deploy --template-file cognito-setup.yml --stack-name membership-cognito --capabilities CAPABILITY_IAM
```

3. **Update Frontend Config:**
```bash
# Update frontend/src/aws-exports.js with real AWS resource IDs
```

4. **Initialize Settings:**
```bash
npm run init-settings
```

## 📊 Demo Data

### Mock Users:
- **Demo User**: 1,250 points, regular member
- **Demo Admin**: 5,000 points, admin privileges

### Mock Transactions:
- Coffee purchases: +10-20 points
- Prize redemptions: -100-500 points
- Various timestamps and branches

### Mock Prizes:
- Free Coffee: 100 points
- Gift Cards: 500-1000 points
- Merchandise: 750 points

## 🎉 What Makes This Special

### 1. **Owner Control**
- Business owners have complete control
- No unwanted chatbot features
- Professional, clean interface when disabled

### 2. **Multilingual AI**
- Automatic language detection
- Seamless Cantonese/English switching
- Cultural sensitivity in responses

### 3. **Mobile-First PWA**
- Install as mobile app
- Offline capabilities
- Native app feel

### 4. **Scalable Architecture**
- Serverless backend
- Real-time data
- Enterprise-ready security

## 🔍 Troubleshooting

### Common Issues:
1. **Port 3000 in use**: Use `npm start -- --port 3001`
2. **Dependencies**: Run `npm install` in frontend directory
3. **Styling issues**: Ensure Tailwind CSS is properly configured

### Reset Demo:
```bash
# Restore original files
git checkout frontend/src/index.js
git checkout frontend/src/App.js
# etc.
```

Enjoy exploring your Membership Points App! 🎊