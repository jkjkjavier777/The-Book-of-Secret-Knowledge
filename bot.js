cat > ~/the-book-of-secret-knowledge/bot.js << 'EOF'
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    return `Error: Could not read ${filePath}.`;
  }
}

function listFiles(dir = '.') {
  try {
    return fs.readdirSync(dir).map(f => path.join(dir, f));
  } catch (err) {
    return [`Error: Could not list ${dir}.`];
  }
}

function collapse(input) {
  const lowerInput = input.toLowerCase().trim();

  if (lowerInput.startsWith('/read ')) {
    const filePath = lowerInput.slice(6).trim();
    return readFile(filePath);
  }
  if (lowerInput === '/files') {
    return `Files in repo:\n${listFiles().join('\n')}`;
  }
  if (lowerInput.includes('hi') || lowerInput.includes('hello')) {
    return "Hi, how can I help you?";
  }
  if (lowerInput.includes('how are you')) {
    return "I'm just a bot, but I'm doing great!";
  }
  if (lowerInput.includes('bye')) {
    return "Goodbye! See you later.";
  }
  return "I don't understand. Try: '/read README.md', '/files', or ask me a question!";
}

console.log("Bot: Hi, how can I help you?");

rl.on('line', (input) => {
  const reply = collapse(input);
  console.log(`Bot: ${reply}`);
});

rl.on('close', () => {
  console.log("Bot: Goodbye!");
  process.exit(0);
});
EOF