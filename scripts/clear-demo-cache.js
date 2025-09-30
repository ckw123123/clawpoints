#!/usr/bin/env node

/**
 * Clear Demo Cache Script
 * 
 * This script provides instructions to clear the demo localStorage cache
 * to ensure new branch data is loaded properly.
 */

console.log('🧹 Demo Cache Clear Instructions');
console.log('================================');
console.log('');
console.log('To see the updated branch information in your demo:');
console.log('');
console.log('1. Open your browser Developer Tools (F12)');
console.log('2. Go to the "Application" or "Storage" tab');
console.log('3. Find "Local Storage" in the left sidebar');
console.log('4. Click on your localhost URL (e.g., http://localhost:3000)');
console.log('5. Delete these keys:');
console.log('   - demo_shared_branches');
console.log('   - demo_shared_branches_v2');
console.log('');
console.log('OR simply run this in your browser console:');
console.log('');
console.log('localStorage.removeItem("demo_shared_branches");');
console.log('localStorage.removeItem("demo_shared_branches_v2");');
console.log('localStorage.clear(); // This clears all demo data');
console.log('');
console.log('Then refresh the page to see the new branch information!');
console.log('');
console.log('✅ New branches will show:');
console.log('   - 旺角 信和中心 101 號鋪');
console.log('   - 石門 京瑞廣場一期 201 號舖');
console.log('   - 旺角中心一期 2樓 S66A');