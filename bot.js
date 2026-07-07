
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const OpenAI = require('openai');

const client = new OpenAI(); // reads OPENAI_API_KEY from env

// ── Load repo docs as context ─────────────────────────
function loadContext() {
  const parts = [];
  const candidates = [
    'README.md',
    'descriptors/duosx_quantum_circuit.md',
    'descriptors/earth99_descriptor.md',
    'descriptors/quantum_descriptor.md',
  ];

  for (const file of candidates) {
    const full = path.join(__dirname, file);
    if (fs.existsSync(full)) {
      const content = fs.readFileSync(full, 'utf8');
      parts.push(`--- ${file} ---\n${content}`);
    }
  }

  if (parts.length === 0) {
    console.log('Bot: Warning — no docs found to load as context.');
  }
  return parts.join('\n\n');
}

const context = loadContext();
const systemPrompt = `You are a helpful assistant answering questions about "The Book of Secret Knowledge" repository, using the following documents as your knowledge source. Summarize, quote sparingly, and say clearly when something isn't covered by these docs.\n\n${context}`;

// ── Chat loop ──────────────────────────────────────────
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Bot: Hello! Ask me about this repo. Type something and press Enter...');

rl.on('line', async (input) => {
  const question = input.trim();
  if (!question) return;

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question },
      ],
    });
    console.log(`Bot: ${response.choices[0].message.content}`);
  } catch (err) {
    console.log(`Bot: Error talking to the API — ${err.message}`);
  }
});

rl.on('close', () => {
  console.log('Bot: Goodbye!');
  process.exit(0);
});
