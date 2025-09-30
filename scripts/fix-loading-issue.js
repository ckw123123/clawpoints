#!/usr/bin/env node

// Emergency fix for loading issues
// This script clears potentially corrupted localStorage data

console.log('🔧 Fixing loading issues...');

// Clear browser localStorage (run this in browser console)
const browserFix = `
// Run this in your browser's Developer Console (F12)
console.log('🧹 Clearing localStorage...');
localStorage.removeItem('demo_shared_settings');
localStorage.removeItem('demo_shared_members');
localStorage.removeItem('demo_shared_prizes');
localStorage.removeItem('demo_shared_items');
localStorage.removeItem('demo_shared_users');
localStorage.removeItem('demo_shared_branches_v2');
localStorage.removeItem('demo_shared_transactions');
console.log('✅ localStorage cleared! Refresh the page.');
`;

console.log('\n📋 Copy and paste this into your browser console (F12):');
console.log('\n' + browserFix);

console.log('\n🔄 Alternative: Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)');
console.log('\n✅ This should fix the infinite loading issue.');