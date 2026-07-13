// Filename: scripts/bot.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const repliesPath = path.join(__dirname, '..', 'data', 'replies.json');
const identityPath = path.join(__dirname, '..', 'data', 'identity.json');
const memoriesPath = path.join(__dirname, '..', 'data', 'memories.json');

const replies = JSON.parse(fs.readFileSync(repliesPath, 'utf8'));
const identity = JSON.parse(fs.readFileSync(identityPath, 'utf8'));

function loadMemories() {
  try {
    return JSON.parse(fs.readFileSync(memoriesPath, 'utf8'));
  } catch (err) {
    return { name: null };
  }
}

// Only ever called explicitly, from the "my name is ..." command below.
// Writes only the { name } field — nothing else, nothing automatic.
function saveMemories(memories) {
  fs.writeFileSync(memoriesPath, JSON.stringify(memories, null, 2));
}

let memories = loadMemories();

// In-session state (resets every run, never written to disk)
let lastKey = null;
let lastReply = null;
const history = [];

function collapse(input) {
  const key = input.trim().toLowerCase();
  const options = replies[key];

  if (!options) {
    if (key === lastKey) {
      return "Still undefined — asking again doesn't change the measurement. Try a different phrase.";
    }
    lastKey = key;
    lastReply = null;
    history.push({ input: key, reply: null });
    return "No entangled reply found for that input yet — still in an undefined state.";
  }

  let choice;
  if (key === lastKey && options.length > 1) {
    const filtered = options.filter((o) => o !== lastReply);
    choice = filtered[Math.floor(Math.random() * filtered.length)];
  } else {
    choice = options[Math.floor(Math.random() * options.length)];
  }

  lastKey = key;
  lastReply = choice;
  history.push({ input: key, reply: choice });

  return choice;
}

function listKnownPhrases() {
  const phrases = Object.keys(replies);
  console.log(`${identity.name} knows ${phrases.length} phrase(s):\n`);
  phrases.forEach((p) => console.log(`  - "${p}"`));
  console.log('');
}

function startChat() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
  });

  const greetingName = memories.name ? `, ${memories.name}` : '';
  console.log(`${identity.name}: ${identity.greeting.replace('I am ' + identity.name, 'I am ' + identity.name + greetingName)}\n`);
  rl.prompt();

  rl.on('line', (line) => {
    const text = line.trim();
    const lower = text.toLowerCase();

    if (lower === 'exit' || lower === 'quit') {
      console.log(`${identity.name}: ${identity.farewell}`);
      rl.close();
      return;
    }

    if (lower === 'history') {
      console.log(`${identity.name}: session history this run —`);
      history.forEach((h, i) => {
        console.log(`  ${i + 1}. "${h.input}" -> ${h.reply || '(undefined)'}`);
      });
      console.log('');
      rl.prompt();
      return;
    }

    if (lower.startsWith('my name is ')) {
      const name = text.slice(11).trim();
      if (name) {
        memories.name = name;
        saveMemories(memories);
        console.log(`${identity.name}: Got it — I'll remember you as ${name}.\n`);
      } else {
        console.log(`${identity.name}: Didn't catch a name there.\n`);
      }
      rl.prompt();
      return;
    }

    if (lower === 'forget me') {
      memories.name = null;
      saveMemories(memories);
      console.log(`${identity.name}: Forgotten. Local memory cleared.\n`);
      rl.prompt();
      return;
    }

    if (lower === 'who am i') {
      console.log(
        memories.name
          ? `${identity.name}: You're ${memories.name}, as far as I've been told.\n`
          : `${identity.name}: I don't have a name saved yet. Try "my name is ...".\n`
      );
      rl.prompt();
      return;
    }

    if (!text) {
      rl.prompt();
      return;
    }

    console.log(`${identity.name}: ` + collapse(text) + '\n');
    rl.prompt();
  });

  rl.on('close', () => {
    process.exit(0);
  });
}

if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--list')) {
    listKnownPhrases();
  } else if (args.length > 0) {
    const arg = args.join(' ');
    console.log(`> ${arg}`);
    console.log(collapse(arg));
  } else {
    startChat();
  }
}

module.exports = { collapse };

