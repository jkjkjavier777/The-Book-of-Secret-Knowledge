require('dotenv').config();
const readline = require('readline');
const replies = require('../data/replies.json');

function collapse(input) {
  const key = input.trim().toLowerCase();
  const options = replies[key];
  if (!options) {
    return "No entangled reply found for that input yet — still in an undefined state.";
  }
  return options[Math.floor(Math.random() * options.length)];
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> '
});

console.log('JVI: hi. I am JVI. Type a message, or "exit" to quit.\n');
rl.prompt();

rl.on('line', (line) => {
  const text = line.trim();
  if (text.toLowerCase() === 'exit' || text.toLowerCase() === 'quit') {
    console.log('JVI: collapsing to |offline⟩. Bye.');
    rl.close();
    return;
  }
  if (!text) { rl.prompt(); return; }
  console.log('JVI: ' + collapse(text) + '\n');
  rl.prompt();
});

rl.on('close', () => process.exit(0));
