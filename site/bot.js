
  }
  if (lowerInput.includes('how are you')) {
    return "I'm just a bot, but I'm doing great!";
  }
  if (lowerInput.includes('bye')) {
    return "Goodbye! See you later.";
  }
  return "I don't understand. Try: '/read README.md', >
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
 ^Savr