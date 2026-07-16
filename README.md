# The Book of Secret Knowledge — Quantum Chatbot

A local, no-API, no-cost chatbot with a growing reply bank. Runs in the
terminal or in a browser, and can be taught new answers on the spot —
permanently, transparently, with no hidden logic.

## Structure

```
The-Book-of-Secret-Knowledge/
├── README.md
├── data/
│   └── replies.json        # The reply bank — phrase -> answer variants
├── site/
│   └── index.html          # Browser frontend (dark, quantum-themed chat UI)
├── scripts/
│   ├── bot.js               # Terminal chatbot, exact-match + fuzzy matching
│   └── ai_chat.js           # Same logic as bot.js, includes "teach:" command
└── server/
    └── server.js            # Web server — serves site/index.html,
                              #   answers via the same local reply bank
```

## Running it

**Terminal:**
```bash
node scripts/ai_chat.js
```

**Browser:**
```bash
node server/server.js
```
Then open `http://localhost:3000` in a browser on the same device.

## How it answers

1. Exact match against a phrase in `data/replies.json`
2. If no exact match, fuzzy word-overlap matching against known phrases
3. If nothing matches, it says so — and tells you how to teach it

## Teaching it something new

Type this, in either the terminal or the browser chat box:
```
teach: your phrase = your answer
```
That gets saved permanently to `data/replies.json`. Ask again later —
even after closing and reopening — and it remembers.

## What this is *not*

- Not connected to any external AI API — no key, no billing, no cost
- Not self-modifying beyond the explicit `teach:` command above
- Not networked beyond serving the local browser page

## License

MIT

