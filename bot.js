// bot.js
const fs = require('fs');
const readline = require('readline');

// Load replies from data/replies.json
const replies = JSON.parse(fs.readFileSync('./data/replies.json', 'utf8'));

// Collapse function: pick a random reply
function collapse(input) {
  const reply = replies[Math.floor(Math.random() * replies.length)];
  return reply;
}

// Interactive chat loop
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'You> '
});

console.log("✨ The Book of Secret Knowledge Chatbot ✨");
rl.prompt();

// Respond to each line of input
rl.on('line', (line) => {
  if (line.trim().toLowerCase() === 'exit') {
    console.log("Bot> Goodbye, entropy awaits...");
    rl.close();
    return;
  }
  console.log("Bot>", collapse(line));
  rl.prompt();
});