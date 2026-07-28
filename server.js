const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Test GET endpoint
app.get('/', (req, res) => {
  res.send('Quantum Chatbot Server is running. Use POST /api/v1/quantum/chat to interact.');
});

// POST endpoint for chat
app.post('/api/v1/quantum/chat', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Missing 'prompt' in request body" });
  }

  if (!process.env.MISTRAL_API_KEY) {
    return res.status(500).json({ error: "MISTRAL_API_KEY is not set in env" });
  }

  try {
    const mistralRes = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'mistral-medium',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!mistralRes.ok) {
      const errText = await mistralRes.text();
      return res.status(mistralRes.status).json({
        error: `Mistral API request failed`,
        details: errText,
      });
    }

    const data = await mistralRes.json();
    const reply = data.choices[0]?.message?.content || "No response generated.";

    res.json({
      status: "SUCCESS",
      response: reply,
      timestamp: new Date().toISOString(),
    });

  } catch (err) {
    console.error('Chat handler error:', err);
    res.status(500).json({
      error: 'Internal server error.',
      details: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Quantum Chatbot Server running on port ${PORT}`);
  console.log(`Access Endpoint: http://localhost:${PORT}/api/v1/quantum/chat`);
});
