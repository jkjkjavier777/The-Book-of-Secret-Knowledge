const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Identity & Endpoint Definitions
app.get('/health', (req, res) => {
  res.status(200).json({
    system: "The-Book-of-Secret-Knowledge",
    status: "RUNNING",
    author: "jkjkjavier777",
    creed: "Change is certain; Uncertainty is for the weak."
  });
});

app.post('/api/v1/quantum/chat', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({
      status: "ERROR",
      error: "Missing 'prompt' in request body"
    });
  }

  if (!MISTRAL_API_KEY) {
    return res.status(500).json({
      status: "ERROR",
      error: "MISTRAL_API_KEY is not set in .env"
    });
  }

  try {
    const mistralRes = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [{ role: 'user', content: prompt }]
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

    res.json({
      status: "SUCCESS",
      response: reply,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Chat handler error:', err);
    res.status(500).json({
      status: "ERROR",
      error: "Internal server error",
      details: err.message
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n==================================================`);
  console.log(`🔥 Quantum Chatbot Server running on port ${PORT}`);
  console.log(`⚡ Access Endpoint: http://localhost:${PORT}/api/v1/quantum/chat`);
  console.log(`==================================================\n`);
});

