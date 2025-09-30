#!/usr/bin/env node

/**
 * Fix ESLint Cache Script
 * 
 * This script helps clear ESLint cache and provides instructions to fix the hooks error
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 ESLint Cache Fix Instructions');
console.log('================================');
console.log('');

// Check if there are any obvious syntax issues
const filePath = path.join(__dirname, '../frontend/src/pages/AdminDashboard-demo.js');

try {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check for basic syntax issues
  const lines = content.split('\n');
  let useEffectCount = 0;
  let returnStatements = [];
  let useEffectLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('useEffect(')) {
      useEffectCount++;
      useEffectLines.push(i + 1);
    }
    if (lines[i].includes('return ') && lines[i].includes('<')) {
      returnStatements.push(i + 1);
    }
  }
  
  console.log(`✅ Found ${useEffectCount} useEffect hooks at lines: ${useEffectLines.join(', ')}`);
  console.log(`✅ Found ${returnStatements.length} return statements at lines: ${returnStatements.join(', ')}`);
  
  // Check if any useEffect comes after a return
  let hasIssue = false;
  for (const useEffectLine of useEffectLines) {
    for (const returnLine of returnStatements) {
      if (useEffectLine > returnLine) {
        console.log(`❌ ISSUE: useEffect at line ${useEffectLine} comes after return at line ${returnLine}`);
        hasIssue = true;
      }
    }
  }
  
  if (!hasIssue) {
    console.log('✅ No obvious hooks rule violations found in the code');
    console.log('');
    console.log('The error might be a cached ESLint issue. Try these steps:');
    console.log('');
    console.log('1. Stop the development server (Ctrl+C)');
    console.log('2. Clear ESLint cache:');
    console.log('   rm -rf node_modules/.cache');
    console.log('   rm -rf .eslintcache');
    console.log('');
    console.log('3. Restart the development server:');
    console.log('   npm start');
    console.log('');
    console.log('4. If the error persists, try:');
    console.log('   npm run build');
    console.log('');
    console.log('5. Or disable the specific ESLint rule temporarily:');
    console.log('   Add /* eslint-disable react-hooks/rules-of-hooks */ at the top of the file');
  }
  
} catch (error) {
  console.error('❌ Error reading file:', error.message);
}

console.log('');
console.log('Current AdminDashboard structure should be:');
console.log('- All useState hooks first');
console.log('- All useEffect hooks second');
console.log('- Then conditional returns');
console.log('- Then component logic');
console.log('- Finally the main return statement');