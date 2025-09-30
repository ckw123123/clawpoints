#!/bin/bash

# GitHub Backup Script
echo "🔄 Backing up current version to GitHub..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
fi

# Add all files
echo "📁 Adding all files..."
git add .

# Commit with timestamp
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
echo "💾 Committing changes..."
git commit -m "Backup: Demo version - $TIMESTAMP"

# Check if remote exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ No GitHub remote found!"
    echo "Please create a GitHub repository and run:"
    echo "git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git"
    echo "git branch -M main"
    echo "git push -u origin main"
    exit 1
fi

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin main

echo "✅ Backup complete!"
echo "Your current demo version is now safely backed up to GitHub."