# 📖 The Book of Knowledge — Quantum Chatbot

A playful archive where inputs begin in **superposition** → collapse → one concrete answer.  
This repo is both a **reply bank** and a **bot engine**.

---

## 📂 Structure

| Path | Purpose |
|------|---------|
| **data/replies.json** | Bank of inputs → reply variants |
| **bot.js** | Collapse logic, picks a random reply |
| **README.md** | Documentation and usage guide |

---

## 🧠 Reply Bank

The chatbot draws from `data/replies.json`. Each key is a lowercase input string, with 2–4 witty quantum‑style variants. Example:

```json
{
  "how are you?": [
    "Currently in superposition: |great) + |tired).",
    "Measuring... collapsed to: pretty good, actually."
  ]
}

const replies = require('./data/replies.json');

/**
 * Given a user input string, return a "collapsed" reply.
 * Falls back to a generic superposition joke if no match is found.
 */
function collapse(input) {
  const key = input.trim().toLowerCase();
  const options = replies[key];

  if (!options) {
    return "No entangled reply found for that input yet — still in an undefined state.";
  }

  const index = Math.floor(Math.random() * options.length);
  return options[index];
}

// Example usage:
if (require.main === module) {
  const input = process.argv.slice(2).join(' ') || "how are you?";
  console.log(`> ${input}`);
  console.log(collapse(input));
}

module.exports = { collapse };