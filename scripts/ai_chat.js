// Filename: scripts/ai_chat.js
//
// LOCAL LEARNING MODE — no API, no key, no billing required.
// Uses fuzzy matching against data/replies.json, and can be taught
// new answers directly, which are saved permanently to that file.

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const repliesPath = path.join(__dirname, '..', 'data', 'replies.json');

function loadReplies() {
  return JSON.parse(fs.readFileSync(repliesPath, 'utf8'));
}

// Only ever called from the explicit "teach:" command below.
function saveReplies(replies) {
  fs.writeFileSync(repliesPath, JSON.stringify(replies, null, 2));
}

let replies = loadReplies();

function words(str) {
  return str.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean);
}

// Exact match first, then fuzzy word-overlap match as a fallback.
function findBestMatch(input) {
  const exactKey = input.trim().toLowerCase();
  if (replies[exactKey]) return exactKey;

  const inputWords = new Set(words(input));
  let bestKey = null;
  let bestScore = 0;

  for (const key of Object.keys(replies)) {
    const keyWords = words(key);
    const overlap = keyWords.filter((w) => inputWords.has(w)).length;
    const score = overlap / keyWords.length;
    if (score > bestScore && score >= 0.6) {
      bestScore = score;
      bestKey = key;
    }
  }

  return bestKey;
}

function collapse(input) {
  const match = findBestMatch(input);
  if (!match) {
    return "I don't understand. Teach me with: teach: your phrase = your answer";
  }
  const options = replies[match];
  return options[Math.floor(Math.random() * options.length)];
}

function teach(input) {
  // Format: teach: phrase = answer
  const body = input.slice(6).trim(); // remove "teach:"
  const parts = body.split('=');
  if (parts.length < 2) {
    return 'Format: teach: your phrase = your answer';
  }
  const phrase = parts[0].trim().toLowerCase();
  const answer = parts.slice(1).join('=').trim();
  if (!phrase || !answer) {
    return 'Format: teach: your phrase = your answer';
  }

  if (!replies[phrase]) {
    replies[phrase] = [];
  }
  replies[phrase].push(answer);
  saveReplies(replies);

  return `Learned it. "${phrase}" now has ${replies[phrase].length} possible answer(s), saved permanently.`;
}

function startChat() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
  });

  console.log('JVI (local learning mode): no API, no cost. Type a message, "teach: phrase = answer" to teach me, or "exit" to quit.\n');
  rl.prompt();

  rl.on('line', (line) => {
    const text = line.trim();
    const lower = text.toLowerCase();

    if (lower === 'exit' || lower === 'quit') {
      console.log('JVI: closing connection. Bye.');
      rl.close();
      return;
    }

    if (!text) {
      rl.prompt();
      return;
    }

    if (lower.startsWith('teach:')) {
      console.log('JVI: ' + teach(text) + '\n');
      rl.prompt();
      return;
    }

    console.log('JVI: ' + collapse(text) + '\n');
    rl.prompt();
  });

  rl.on('close', () => {
    process.exit(0);
  });
}

startChat();

