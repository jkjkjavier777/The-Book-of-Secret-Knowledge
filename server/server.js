// Filename: server/server.js
//
// LOCAL LEARNING SERVER — no API key, no billing required.
// Serves the browser frontend (site/index.html) and answers chat
// requests using the same reply bank + teach logic as scripts/ai_chat.js.

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const repliesPath = path.join(__dirname, '..', 'data', 'replies.json');

function loadReplies() {
  return JSON.parse(fs.readFileSync(repliesPath, 'utf8'));
}

function saveReplies(replies) {
  fs.writeFileSync(repliesPath, JSON.stringify(replies, null, 2));
}

function words(str) {
  return str.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean);
}

function findBestMatch(input, replies) {
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
  const replies = loadReplies();
  const match = findBestMatch(input, replies);
  if (!match) {
    return "I don't understand. Teach me with: teach: your phrase = your answer";
  }
  const options = replies[match];
  return options[Math.floor(Math.random() * options.length)];
}

function teach(input) {
  const replies = loadReplies();
  const bodyText = input.slice(6).trim();
  const parts = bodyText.split('=');
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

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'site')));

app.post('/api/chat', (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Missing "message" string in request body.' });
  }

  try {
    const lower = message.trim().toLowerCase();
    const reply = lower.startsWith('teach:') ? teach(message) : collapse(message);
    res.json({ reply });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.get('/api/status', (req, res) => {
  const replies = loadReplies();
  res.json({ status: 'ok', mode: 'local-learning', phraseCount: Object.keys(replies).length });
});

app.listen(PORT, () => {
  console.log(`Quantum chatbot server (local learning mode) running at http://localhost:${PORT}`);
});
