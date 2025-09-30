#!/usr/bin/env node

/**
 * Fix Duplicate Users Section Script
 * 
 * This script removes the duplicate "Users Tab" section from AdminDashboard-demo.js
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../frontend/src/pages/AdminDashboard-demo.js');

try {
  // Read the file
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Split into lines
  const lines = content.split('\n');
  
  // Find the duplicate Users Tab section (second occurrence)
  let firstUsersTabIndex = -1;
  let secondUsersTabIndex = -1;
  let branchesTabIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('{/* Users Tab (Admin Only) */}')) {
      if (firstUsersTabIndex === -1) {
        firstUsersTabIndex = i;
      } else if (secondUsersTabIndex === -1) {
        secondUsersTabIndex = i;
      }
    }
    if (lines[i].includes('{/* Branches Tab */}')) {
      branchesTabIndex = i;
    }
  }
  
  console.log('First Users Tab found at line:', firstUsersTabIndex + 1);
  console.log('Duplicate Users Tab found at line:', secondUsersTabIndex + 1);
  console.log('Branches Tab found at line:', branchesTabIndex + 1);
  
  if (secondUsersTabIndex !== -1 && branchesTabIndex !== -1) {
    // Remove the duplicate section (from second Users Tab to before Branches Tab)
    const newLines = [
      ...lines.slice(0, secondUsersTabIndex),
      ...lines.slice(branchesTabIndex)
    ];
    
    // Write the fixed content back
    const newContent = newLines.join('\n');
    fs.writeFileSync(filePath, newContent, 'utf8');
    
    console.log('✅ Successfully removed duplicate Users Tab section!');
    console.log(`Removed lines ${secondUsersTabIndex + 1} to ${branchesTabIndex}`);
  } else {
    console.log('❌ Could not find duplicate section boundaries');
  }
  
} catch (error) {
  console.error('Error fixing duplicate section:', error);
}