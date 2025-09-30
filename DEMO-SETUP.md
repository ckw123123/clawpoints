# 🚀 Local Demo Setup Guide

This guide will help you run the full-featured local demo of the Loyalty Points System.

## ✅ Quick Start

### Option 1: Automated Setup (Recommended)
```bash
# Run the automated setup script
./scripts/run-local-demo.sh
```

### Option 2: Manual Setup
```bash
# 1. Install dependencies
cd frontend
npm install

# 2. Run demo mode
npm run demo
```

## 🔑 Demo Login Credentials

### 👤 Demo User (Member)
- **Username**: john_doe
- **Password**: demo123
- **Access**: Member features only

### 👨‍💼 Demo Sales Staff
- **Role**: Sales User
- **Access**: Member management, prizes, items (NO user management)

### 👑 Demo Admin (Shop Owner)
- **Role**: Admin
- **Access**: Full system access including user management

## 🎯 Available Features

### ✅ For All Roles:
- Multi-language support (English/Chinese)
- Responsive design
- Real-time data updates

### ✅ Member Features:
- View points balance
- Transaction history
- Profile management

### ✅ Sales Staff Features:
- **Member Management**: Add, edit, delete members
- **Prize Management**: Manage reward items
- **Item Management**: Manage point-earning items
- **Barcode Scanning**: Process transactions
- **Search & Browse**: Find members quickly

### ✅ Admin Features (All Sales features plus):
- **User Management**: Add/edit/delete sales staff
- **Role Assignment**: Assign admin or sales roles
- **Branch Management**: Manage store locations
- **System Settings**: Configure system parameters

## 🎨 Demo Data Included

### 👥 Members (10 sample members)
- John Doe, Jane Smith, Mike Johnson, etc.
- Various point balances and transaction histories

### 🎁 Prizes (5 sample prizes)
- Small toys, candy, gift cards, t-shirts
- Different point costs and stock levels

### 🛍️ Items (6 sample items)
- Coffee (Small/Medium/Large), sandwiches, pastries
- Different point values for earning

### 🏢 Branches (3 sample locations)
- Downtown, Mall, Airport branches
- Contact information included

## 🔧 Technical Details

### Data Storage
- Uses localStorage for persistence
- Data survives browser refresh
- Reset function available in admin panel

### Architecture
- React 18 with functional components
- Context API for state management
- Tailwind CSS for styling
- React Router for navigation

### File Structure
```
frontend/src/
├── App-demo.js              # Demo-specific app configuration
├── contexts/
│   ├── AuthContext-demo.js      # Demo authentication
│   ├── SharedDataContext-demo.js # Demo data management
│   └── SettingsContext-demo.js  # Demo settings
├── components/
│   └── DemoAuthenticator.js     # Demo login component
└── pages/
    └── AdminDashboard-demo.js   # Full-featured admin panel
```

## 🚀 Getting Started

1. **Clone the repository** (if you haven't already)
2. **Run the setup script**: `./scripts/run-local-demo.sh`
3. **Open your browser** to `http://localhost:3000`
4. **Login with demo credentials** (see above)
5. **Explore the features** based on your role

## 🎯 Testing Scenarios

### Test User Management (Admin only):
1. Login as Demo Admin
2. Go to "Users" tab
3. Add a new sales user
4. Edit existing users
5. Try role assignments

### Test Member Management:
1. Login as Sales or Admin
2. Go to "Members" tab
3. Click "Show All (10)" to see all members
4. Search for specific members
5. Edit member details
6. View transaction history

### Test Point Transactions:
1. Use barcode scanner
2. Scan item barcodes (starts with 1) to add points
3. Scan prize barcodes (starts with 2) to redeem points
4. View updated member balances

## 🔄 Reset Demo Data

If you want to reset all demo data to original state:
1. Login as Admin
2. Go to Settings
3. Click "Reset Demo Data"
4. Confirm the reset

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Dependencies Issues
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Browser Cache Issues
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Clear localStorage: Open DevTools → Application → Storage → Clear

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify all dependencies are installed
3. Ensure you're running the correct npm script (`npm run demo`)
4. Try resetting demo data if behavior seems inconsistent

---

**Happy Testing! 🎉**