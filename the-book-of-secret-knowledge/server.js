// server/server.js
// Filename: server/server.js
//
// Minimal Express backend for the quantum chatbot.
// The API key is NEVER hardcoded here — it's read from an environment
// variable at runtime. Set it in a local .env file (see .env.example),
// which must stay out of git (already covered by .gitignore).

require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.ANTHROPIC_API_KEY;

if (!API_KEY) {
  console.error('Missing ANTHROPIC_API_KEY. Set it in your local .env file — see .env.example.');
  process.exit(1);
}

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'site')));

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Missing "message" string in request body.' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 300,
        messages: [{ role: 'user', content: message }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API error:', response.status, errText);
      return res.status(502).json({ error: 'Upstream API error.' });
    }

    const data = await response.json();
    const textBlock = data.content.find((block) => block.type === 'text');
    const reply = textBlock ? textBlock.text : 'No text reply returned.';

    res.json({ reply });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Quantum chatbot server running at http://localhost:${PORT}`);
});
