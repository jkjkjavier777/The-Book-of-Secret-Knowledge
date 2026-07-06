# quantum-chatbot-replies

A small reply bank for a "quantum computer" persona chatbot — designed to
turn boring small-talk into playful pseudo-physics one-liners, instead of
flat non-answers like "Nada."

## Pattern

Each reply follows the same shape:
1. State a superposition of two moods/answers.
2. Note that the question "measures" or "collapses" it.
3. Land on one concrete, friendly answer.

This keeps the bot fun without ever actually dodging the question.

## Structure

```
quantum-chatbot/
├── data/
│   └── replies.json   # input -> array of possible replies
├── bot.js             # picks a random reply for a given input
└── README.md
```

## Usage

```bash
node bot.js "how are you?"
```

```
> how are you?
Currently in superposition: |great⟩ + |tired⟩. Ask again to collapse the wavefunction.
```

## Adding new inputs

Add a new key to `data/replies.json`, lowercase, with 2–4 reply variants:

```json
"do you dream?": [
  "Every idle cycle. Mostly about better hash functions.",
  "Only in binary, and only when nobody's measuring."
]
```

## Publishing to GitHub

From this folder:

```bash
git init
git add .
git commit -m "Initial quantum chatbot reply bank"
git branch -M main
git remote add origin https://github.com/<your-username>/quantum-chatbot-replies.git
git push -u origin main
```
