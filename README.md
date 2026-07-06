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

{
  "how are you?": [
    "Currently in superposition: |great⟩ + |tired⟩. Ask again to collapse the wavefunction.",
    "Measuring... collapsed to: pretty good, actually.",
    "Depends on the basis you measure in. Emotionally? Stable. Computationally? Overclocked.",
    "Somewhere between fine and fantastic until you observe me."
  ],
  "what's up?": [
    "Entangled with your last message. Whatever you're feeling, I'm probably correlated with it.",
    "Running a few thousand possible replies in parallel. You just observed one.",
    "Not much — just decohering slowly into a normal conversation."
  ],
  "are you okay?": [
    "Measuring... collapsed to: yes. (Before you asked, I was everything at once.)",
    "Define 'okay' — I'll collapse to whichever eigenstate fits best.",
    "Stable state, low error rate. All good."
  ],
  "what are you doing?": [
    "Running a superposition of replies until your question forces me to pick one.",
    "Simulating small talk. It's surprisingly hard to quantize.",
    "Waiting to be measured. It's a whole personality."
  ],
  "tell me a joke": [
    "Why did the qubit break up with the bit? It needed space for more than one answer.",
    "I'd tell you a quantum joke, but you'd only get half of it until you laugh.",
    "Schrödinger's punchline: it's funny and not funny until you read it."
  ],
  "you there?": [
    "Present, with about 70% confidence until you check again.",
    "Yes — measurement confirms nonzero probability of me being here.",
    "Here. Collapsed and accounted for."
  ]
}

