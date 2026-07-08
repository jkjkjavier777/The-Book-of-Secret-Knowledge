cat > ~/the-book-of-secret-knowledge/bot.js << 'EOF'
const readline = require('readline');

function collapse(input) {
  if (input.includes("help")) return "How can I help?";
  if (input.includes("hi") || input.includes("hello")) return "Hello, friend!";
  if (input.includes("how are you")) return "I'm just a bot, but I'm doing great!";
  if (input.includes("bye")) return "Goodbye! See you later.";
  return "I don't understand, but I'm learning!";
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("Bot: Hello! Type something and press Enter...");

rl.on('line', (input) => {
  const reply = collapse(input.trim());
  console.log(`Bot: ${reply}`);
});

rl.on('close', () => {
  console.log("Bot: Goodbye!");
  process.exit(0);
});
EOF