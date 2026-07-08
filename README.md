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