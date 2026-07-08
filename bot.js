const fs = require('fs');
const path = require('path');
const replies = require('./data/replies.json');

/**
 * Collapse logic: normal replies OR self-edit commands.
 */
async function collapse(input) {
  const key = input.trim().toLowerCase();

  // --- Self-edit commands ---
  if (key.startsWith('/append ')) {
    const text = input.slice(8).trim();
    fs.appendFileSync('README.md', `\n${text}\n`);
    return `Appended to README.md: "${text}"`;
  }

  if (key.startsWith('/addreply ')) {
    const [trigger, ...variants] = input.slice(10).split('|').map(s => s.trim());
    replies[trigger] = variants;
    fs.writeFileSync(path.join(__dirname, 'data/replies.json'), JSON.stringify(replies, null, 2));
    return `Added new reply set for "${trigger}" with ${variants.length} variants.`;
  }

  // --- Normal collapse replies ---
  const options = replies[key];
  if (!options) {
    return "No entangled reply found for that input yet — still in an undefined state.";
  }
  const index = Math.floor(Math.random() * options.length);
  return options[index];
}

// Interactive loop
const readline = require('readline');
const rl = readline.create