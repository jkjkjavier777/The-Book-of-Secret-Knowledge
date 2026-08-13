const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

const KNOWLEDGE_PATH = path.join(__dirname, 'data', 'knowledge.json');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ---------- Knowledge base helpers ----------

function ensureKnowledgeFile() {
  const dir = path.dirname(KNOWLEDGE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(KNOWLEDGE_PATH)) fs.writeFileSync(KNOWLEDGE_PATH, '[]');
}

function loadKnowledge() {
  ensureKnowledgeFile();
  try {
    return JSON.parse(fs.readFileSync(KNOWLEDGE_PATH, 'utf8'));
  } catch (err) {
    console.error('Knowledge file corrupted, starting fresh:', err.message);
    return [];
  }
}

function saveKnowledge(entries) {
  fs.writeFileSync(KNOWLEDGE_PATH, JSON.stringify(entries, null, 2));
}

// Adds a new entry to the book. This is the "self-writing" part —
// every exchange gets appended automatically, no manual editing needed.
function appendKnowledge(entry) {
  const entries = loadKnowledge();
  entries.push({
    id: entries.length + 1,
    timestamp: new Date().toISOString(),
    ...entry
  });
  saveKnowledge(entries);
}

// Very simple keyword-overlap search — no external libraries needed.
// Good enough for a personal knowledge base; swap for embeddings later if it grows large.
function findRelevantKnowledge(prompt, limit = 3) {
  const entries = loadKnowledge();
  if (entries.length === 0) return [];

  const promptWords = prompt.toLowerCase().split(/\W+/).filter(w => w.length > 3);

  const scored = entries.map(entry => {
    const text = (entry.text || '').toLowerCase();
    const score = promptWords.reduce((acc, word) => acc + (text.includes(word) ? 1 : 0), 0);
    return { entry, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.entry);
}

// ---------- Routes ----------

app.get('/health', (req, res) => {
  res.status(200).json({
    system: "The-Book-of-Secret-Knowledge",
    status: "RUNNING",
    author: "jkjkjavier777",
    creed: "Change is certain; Uncertainty is for the weak."
  });
});

// View how many entries are in the book, and the most recent ones
app.get('/api/v1/quantum/knowledge', (req, res) => {
  const entries = loadKnowledge();
  res.json({
    status: "SUCCESS",
    count: entries.length,
    recent: entries.slice(-10)
  });
});

// Manually add a fact to the book yourself, instead of waiting for it to self-write
app.post('/api/v1/quantum/knowledge', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ status: "ERROR", error: "Missing 'text' in request body" });
  }
  appendKnowledge({ text, source: 'manual' });
  res.json({ status: "SUCCESS", message: "Entry added to the book." });
});

app.post('/api/v1/quantum/chat', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ status: "ERROR", error: "Missing 'prompt' in request body" });
  }
  if (!MISTRAL_API_KEY) {
    return res.status(500).json({ status: "ERROR", error: "MISTRAL_API_KEY is not set in .env" });
  }

  try {
    // 1. Pull anything relevant out of the book
    const relevant = findRelevantKnowledge(prompt);
    const context = relevant.length
      ? 'Known facts from your knowledge base:\n' + relevant.map(e => `- ${e.text}`).join('\n')
      : null;

    const messages = [];
    if (context) {
      messages.push({ role: 'system', content: context });
    }
    messages.push({ role: 'user', content: prompt });

    // 2. Ask Mistral, using that context if we found any
    const mistralRes = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages
      })
    });

    if (!mistralRes.ok) {
      const errText = await mistralRes.text();
      console.error('Mistral API error:', mistralRes.status, errText);
      return res.status(mistralRes.status).json({
        status: "ERROR",
        error: "Mistral API request failed",
        details: errText
      });
    }

    const data = await mistralRes.json();
    const reply = data.choices?.[0]?.message?.content || "No response generated.";

    // 3. Self-write: append this exchange to the book automatically
    appendKnowledge({ text: `Q: ${prompt}\nA: ${reply}`, source: 'auto' });

    res.json({
      status: "SUCCESS",
      response: reply,
      used_context: relevant.length,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Chat handler error:', err);
    res.status(500).json({ status: "ERROR", error: "Internal server error", details: err.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  ensureKnowledgeFile();
  console.log(`\n==================================================`);
  console.log(`🔥 Quantum Chatbot Server running on port ${PORT}`);
  console.log(`⚡ Access Endpoint: http://localhost:${PORT}/api/v1/quantum/chat`);
  console.log(`📖 Knowledge base: ${KNOWLEDGE_PATH}`);
  console.log(`==================================================\n`);
});

