#!/bin/bash

# Print header
echo "===== DIAGNOSTIC: The-Book-of-Secret-Knowledge ====="

# 1. Check current directory
echo -e "\n📁 Current Directory: $(pwd)"

# 2. List all files/directories
echo -e "\n📂 Files/Directories in Current Location:"
ls -la

# 3. Check if Node.js and npm are installed
echo -e "\n🔹 Node.js and npm Status:"
node --version
npm --version

# 4. Check for package.json and node_modules
echo -e "\n📦 Node.js Project Status:"
if [ -f "package.json" ]; then
  echo "✅ package.json exists"
  cat package.json | jq '.name, .version, .dependencies' 2>/dev/null || echo "⚠️ jq not installed (install with: pkg install jq)"
else
  echo "❌ package.json missing"
fi

if [ -d "node_modules" ]; then
  echo "✅ node_modules exists"
else
  echo "❌ node_modules missing (run: npm install)"
fi

# 5. Check for server.js or bot.js
echo -e "\n🤖 Bot Server Files:"
for file in server.js bot.js; do
  if [ -f "$file" ]; then
    echo "✅ $file exists"
  else
    echo "❌ $file missing"
  fi
done

# 6. Check for config.json
echo -e "\n⚙️ Configuration Files:"
if [ -f "config.json" ]; then
  echo "✅ config.json exists"
else
  echo "❌ config.json missing"
fi

# 7. Check for common errors in Node.js paths
echo -e "\n🔍 Path Resolution Test:"
node -e "
const path = require('path');
const fs = require('fs');
const testPaths = [
  './server.js',
  './bot.js',
  './config.json',
  './scripts/chatbot/bot.js',
  './scripts/chatbot/config.json'
];
testPaths.forEach(p => {
  const exists = fs.existsSync(p);
  console.log(exists ? '✅' : '❌', p);
});
"

# 8. Check for Python files
echo -e "\n🐍 Python Files:"
for file in bot.py run_trial.py analyze_results.py; do
  if [ -f "$file" ]; then
    echo "✅ $file exists"
  else
    echo "❌ $file missing"
  fi
done

# 9. Check Python installation
echo -e "\n🔹 Python Status:"
python --version 2>&1 || echo "❌ Python not installed (install with: pkg install python)"

# 10. Check for Termux-specific issues
echo -e "\n📱 Termux Environment:"
echo "TERMUX_VERSION: $TERMUX_VERSION"
echo "PREFIX: $PREFIX"
echo "HOME: $HOME"

# 11. Check for missing scripts
echo -e "\n🔥 Common Issues:"
if [ ! -f "package.json" ] && [ ! -f "server.js" ] && [ ! -f "bot.js" ]; then
  echo "⚠️ No Node.js project files found. Did you run 'npm init'?"
fi

if [ ! -d "node_modules" ]; then
  echo "⚠️ node_modules missing. Run 'npm install' to install dependencies."
fi

if ! command -v node &> /dev/null; then
  echo "⚠️ Node.js not installed. Install with: pkg install nodejs"
fi

if ! command -v npm &> /dev/null; then
  echo "⚠️ npm not installed. Install with: pkg install nodejs"
fi

echo -e "\n===== DIAGNOSTIC COMPLETE ====="
