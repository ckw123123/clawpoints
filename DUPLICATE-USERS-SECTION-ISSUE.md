# Duplicate Users Section Issue in AdminDashboard

## Problem
There are two identical "User Management (Demo)" sections in the AdminDashboard component, causing duplicate content and confusion.

## Location
- **File**: `frontend/src/pages/AdminDashboard-demo.js`
- **First Section**: Around line 1866-2069
- **Duplicate Section**: Around line 2070-2849

## Evidence
Search results show duplicate "Add User" buttons:
- Line 1986: `onClick={() => setShowAddUser(true)}`
- Line 2190: `onClick={() => setShowAddUser(true)}`

## Solution Required
Remove the duplicate Users Tab section (lines 2070-2849) that appears after the first Users section.

## What to Remove
The entire duplicate section starting with:
```javascript
{/* Users Tab (Admin Only) */}
{activeTab === 'users' && canManageUsers && (
```

And ending before:
```javascript
{/* Branches Tab */}
{activeTab === 'branches' && (
```

## Current Status
- ✅ Password management functionality is working in the first Users section
- ✅ Admin can change passwords for all users (yellow "Change Password" button)
- ❌ Duplicate section needs manual removal due to file size

## Manual Fix Instructions
1. Open `frontend/src/pages/AdminDashboard-demo.js`
2. Find the second occurrence of `{/* Users Tab (Admin Only) */}` around line 2070
3. Delete everything from that line until the `{/* Branches Tab */}` comment
4. Keep only the first Users Tab section (around line 1866)

## Expected Result
- Single "User Management (Demo)" section
- Admin can edit passwords of all users
- No duplicate content
- Clean, organized admin interface

## Features Confirmed Working
- ✅ Branch selector shows correct real branch names
- ✅ Password management for users and members
- ✅ Language switching (EN/TC)
- ✅ All CRUD operations for users, members, prizes, items
- ✅ Pagination in transaction records