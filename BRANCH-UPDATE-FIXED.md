# Branch Information Update - Fixed

## Issue
The demo was showing old branch information ("Downtown Branch") instead of the new real branch data because the browser was using cached data from localStorage.

## Root Cause
The SharedDataContext was loading branch data from localStorage first, and if cached data existed, it would use the old data instead of the updated INITIAL_DATA.

## Solution Applied

### 1. Updated Storage Key Version
```javascript
branches: 'demo_shared_branches_v2', // Updated version to force refresh
```

### 2. Force Clear Old Cache
```javascript
const [branches, setBranches] = useState(() => {
  // Clear any old branch data and use the new data
  localStorage.removeItem('demo_shared_branches');
  return INITIAL_DATA.branches;
});
```

### 3. Updated Branch Data Structure
```javascript
branches: [
  { 
    id: '1', 
    name: '旺角 信和中心 101 號鋪',
    nameEn: 'Shop 101, Sino Centre, Mong Kok',
    whatsapp: '+852 5522 3344', 
    phone: '+852 5522 3344' 
  },
  { 
    id: '2', 
    name: '石門 京瑞廣場一期 201 號舖',
    nameEn: 'Shop 201, Phase 1, Kings Wing Plaza, Shek Mun',
    whatsapp: '+852 6622 3388', 
    phone: '+852 6622 3388' 
  },
  { 
    id: '3', 
    name: '旺角中心一期 2樓 S66A',
    nameEn: 'Shop S66A, 2/F, Argyle Centre Phase 1, Mong Kok',
    whatsapp: '+852 9922 8833', 
    phone: '+852 9922 8833' 
  }
]
```

## How to Clear Cache (If Still Seeing Old Data)

### Method 1: Browser Developer Tools
1. Open Developer Tools (F12)
2. Go to "Application" or "Storage" tab
3. Find "Local Storage" → your localhost URL
4. Delete keys: `demo_shared_branches`, `demo_shared_branches_v2`
5. Refresh page

### Method 2: Browser Console
```javascript
localStorage.removeItem("demo_shared_branches");
localStorage.removeItem("demo_shared_branches_v2");
// Or clear all demo data:
localStorage.clear();
```

### Method 3: Use Clear Script
```bash
node scripts/clear-demo-cache.js
```

## Expected Result
After clearing cache and refreshing, John's transaction records should now show:

```
Coffee - Medium                    +15
Jan 20, 2024, 10:30 AM
📍 旺角 信和中心 101 號鋪           Balance: 1,250
```

Instead of the old "Downtown Branch" text.

## Files Modified
1. `frontend/src/contexts/SharedDataContext-demo.js` - Updated branch data and cache handling
2. `frontend/src/pages/Records-demo.js` - Updated transaction history
3. `frontend/src/pages/Home-demo.js` - Updated branch display
4. `scripts/clear-demo-cache.js` - Cache clearing instructions

## Testing
1. Clear browser cache/localStorage
2. Refresh the demo application
3. Login as John (Demo User)
4. Check Transaction Records page
5. Verify branch names show the real locations in both languages