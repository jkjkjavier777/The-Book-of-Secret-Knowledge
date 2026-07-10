const fs = require('fs');
const path = require('path');
const readline = require('readline');

const repliesPath = path.join(__dirname, 'data', 'replies.json');
const replies = require(repliesPath);

async function collapse(input) {
  const key = input.trim().toLowerCase();

  if (key.startsWith('/append ')) {
    const text = input.slice(8).trim();
    fs.appendFileSync(path.join(__dirname, 'README.md'), `
${text}
`);
    return `Appended to README.md: "${text}"`;
  }

  if (key.startsWith('/addreply ')) {
    const [trigger, ...variants] = input.slice(10).split('|').map(s => s.trim());
    replies[trigger] = variants;
    fs.writeFileSync(repliesPath, JSON.stringify(replies, null, 2));
    return `Added new reply set for "${trigger}" with ${variants.length} variants.`;
  }

  const options = replies[key];
  if (!options) {
    return "No entangled reply found for that input yet — still in an undefined state.";
  }

  const index = Math.floor(Math.random() * options.length);
  return options[index];
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', async (input) => {
  const reply = await collapse(input);
  console.log(reply);
});