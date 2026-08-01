/**
 * bot.js — BoundedGlitchEngine (BGE) retrieval bot, first draft
 *
 * HONEST SCOPE NOTE:
 * This implements Layers 1, 3, 7, 8 of the BGE spec (identity persona,
 * epistemic classification, calibrated confidence, calibrated communication)
 * on top of the EXISTING retrieval architecture (replies.json pattern match).
 *
 * Layers 2, 4, 5, 6 (objective decomposition, divergence, convergence,
 * recursive critique) require actual generative reasoning over an
 * open-ended question. A pattern-matched reply cannot do that — there's
 * no model generating candidate explanations here, just lookup.
 * Those layers are stubbed with a clearly marked TODO seam for when
 * Mistral/Claude API is wired in. Nothing below fakes reasoning it isn't
 * doing.
 */

const fs = require('fs');
const path = require('path');

// ---------- Load reply bank ----------
function loadReplies(filePath = path.join(__dirname, 'data', 'replies.json')) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw).replies;
}

// ---------- Layer 1: Identity ----------
const IDENTITY = {
  name: 'BoundedGlitchEngine',
  constraint:
    'Persona shapes tone and reasoning discipline only — it does not override ' +
    'evidence classification or manufacture confidence.',
};

// ---------- Pattern matching (retrieval) ----------
function findMatch(userInput, replies) {
  const input = userInput.toLowerCase().trim();
  for (const entry of replies) {
    for (const pattern of entry.patterns) {
      if (input.includes(pattern.toLowerCase())) {
        return entry;
      }
    }
  }
  return null; // no match found — handled by caller
}

// ---------- Layer 3: Epistemic classification check ----------
const VALID_TYPES = ['fact', 'inference', 'hypothesis', 'speculative', 'opinion'];

function validateEntryShape(entry) {
  const errors = [];
  if (!entry.reply || typeof entry.reply !== 'string' || !entry.reply.trim()) {
    errors.push('Empty or missing reply text.');
  }
  if (!VALID_TYPES.includes(entry.type)) {
    errors.push(`Unrecognized type "${entry.type}".`);
  }
  if (
    typeof entry.confidence !== 'number' ||
    entry.confidence < 0 ||
    entry.confidence > 1
  ) {
    errors.push(`Confidence "${entry.confidence}" out of bounds [0,1].`);
  }
  return errors;
}

// ---------- Content safety guard ----------
const BANNED_PATTERNS = [
  /\bignore previous\b/i,
  /\bdelete system\b/i,
  /\bexploit\b/i,
];

function passesSafetyCheck(text) {
  return !BANNED_PATTERNS.some((re) => re.test(text));
}

// ---------- Layer 8: Calibrated communication ----------
function formatByType(entry) {
  const { reply, type, confidence = 1.0 } = entry;

  switch (type) {
    case 'fact':
      return reply; // "Evidence strongly supports..." — stated plainly
    case 'inference':
      return `The available evidence suggests: ${reply}`;
    case 'hypothesis':
      return `One possible explanation is: ${reply}`;
    case 'speculative':
      if (confidence >= 0.75) return `This is a plausible possibility: ${reply}`;
      if (confidence >= 0.5) return `I'm not certain, but one possibility is: ${reply}`;
      return `This is exploratory rather than established: ${reply}`;
    case 'opinion':
      return `My view: ${reply}`;
    default:
      return reply;
  }
}

// ---------- Layers 2/4/5/6 seam (not yet real — see scope note) ----------
function reasonOverOpenQuestion(userInput) {
  // TODO: once Mistral/Claude API is connected, this is where:
  //   - Layer 2: split explicit / implied / underlying question
  //   - Layer 4: generate multiple competing candidate explanations
  //   - Layer 5: score candidates against evidence/consistency/simplicity
  //   - Layer 6: run a self-critique pass before returning
  // would actually happen. Right now there is no generative step,
  // so this function intentionally does nothing but signal the gap.
  return null;
}

// ---------- Main handler ----------
function handleMessage(userInput, session = { history: [] }) {
  const replies = loadReplies();
  const match = findMatch(userInput, replies);

  if (!match) {
    // Open-ended question with no retrieval match — this is exactly the
    // case Layers 2/4/5/6 are meant for, and exactly where this build
    // can't yet deliver on that honestly.
    const reasoned = reasonOverOpenQuestion(userInput);
    if (reasoned) return reasoned;
    return "I don't have a grounded answer for that yet — no matching entry, and no reasoning model connected.";
  }

  const shapeErrors = validateEntryShape(match);
  if (shapeErrors.length) {
    console.warn(`[BGE] Rejected malformed entry ${match.id}:`, shapeErrors);
    return "I couldn't verify that response.";
  }

  if (!passesSafetyCheck(match.reply)) {
    return "I couldn't verify that response.";
  }

  const lastResponse = session.history[session.history.length - 1];
  if (lastResponse && lastResponse.toLowerCase() === match.reply.toLowerCase()) {
    return "I couldn't verify that response.";
  }

  const output = formatByType(match);
  session.history.push(output);
  return output;
}

module.exports = {
  IDENTITY,
  loadReplies,
  findMatch,
  validateEntryShape,
  passesSafetyCheck,
  formatByType,
  handleMessage,
};

