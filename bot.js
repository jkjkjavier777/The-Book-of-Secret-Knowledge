const readline = require('readline');
const fetch = require('node-fetch'); // Install with: npm install node-fetch

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Replace with your GitHub username and repo name
const GITHUB_USER = 'your-username';
const GITHUB_REPO = 'the-book-of-secret-knowledge';
const GITHUB_API_BASE = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/`;

// Optional: Add a GitHub token for private repos or higher rate limits
const GITHUB_TOKEN = 'your-github-token'; // Leave empty for public repos

async function fetchFile(filePath) {
  const url = `${GITHUB_API_BASE}${filePath}`;
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Node.js Bot'
  };
  if (GITHUB_TOKEN) headers['Authorization'] = `token ${GITHUB_TOKEN}`;

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) return `Error: Could not fetch ${filePath}.`;
    const data = await response.json();
    if (data.type === 'file') {
      const content = Buffer.from(data.content, 'base64').toString('utf8');
      return content;
    } else {
      return `Error: ${filePath} is not a file.`;
    }
  } catch (err) {
    return `Error: ${err.message}`;
  }
}

async function listFiles(dir = '') {
  const url = `${GITHUB_API_BASE}${dir}`;
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Node.js Bot'
  };
  if (GITHUB_TOKEN) headers['Authorization'] = `token ${GITHUB_TOKEN}`;

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) return [`Error: Could not list ${dir}.`];
    const files = await response.json();
    return files.map(file => file.name);
  } catch (err) {
    return [`Error: ${err.message}`];
  }
}

async function collapse(input) {
  const lowerInput = input.toLowerCase().trim();

  if (lowerInput.startsWith('/read ')) {
    const filePath = lowerInput.slice(6).trim();
    return await fetchFile(filePath);
  }
  if (lowerInput === '/files') {
    const files = await listFiles();
    return `Files in repo:\n${files.join('\n')}`;
  }
  if (lowerInput.includes('hi') || lowerInput.includes('hello')) {
    return "Hi, how can I help you?";
  }
  if (lowerInput.includes('how are you')) {
    return "I'm just a bot, but I'm doing great!";
  }
  if (lowerInput.includes('bye')) {
    return "Goodbye! See you later.";
  }
  return "I don't understand. Try: '/read README.md', '/files', or ask me a question!";
}

console.log("Bot: Hi, how can I help you?");

rl.on('line', async (input) => {
  const reply = await collapse(input);
  console.log(`Bot: ${reply}`);
});

rl.on('close', () => {
  console.log("Bot: Goodbye!");
  process.exit(0);
});

---

---

const readline = require('readline');
const fetch = require('node-fetch'); // Install with: npm install node-fetch

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Replace with your GitHub username and repo name
const GITHUB_USER = 'your-username';
const GITHUB_REPO = 'the-book-of-secret-knowledge';
const GITHUB_API_BASE = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/`;

// Optional: Add a GitHub token for private repos or higher rate limits
const GITHUB_TOKEN = 'your-github-token'; // Leave empty for public repos

async function fetchFile(filePath) {
  const url = `${GITHUB_API_BASE}${filePath}`;
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Node.js Bot'
  };
  if (GITHUB_TOKEN) headers['Authorization'] = `token ${GITHUB_TOKEN}`;

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) return `Error: Could not fetch ${filePath}.`;
    const data = await response.json();
    if (data.type === 'file') {
      const content = Buffer.from(data.content, 'base64').toString('utf8');
      return content;
    } else {
      return `Error: ${filePath} is not a file.`;
    }
  } catch (err) {
    return `Error: ${err.message}`;
  }
}

async function listFiles(dir = '') {
  const url = `${GITHUB_API_BASE}${dir}`;
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Node.js Bot'
  };
  if (GITHUB_TOKEN) headers['Authorization'] = `token ${GITHUB_TOKEN}`;

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) return [`Error: Could not list ${dir}.`];
    const files = await response.json();
    return files.map(file => file.name);
  } catch (err) {
    return [`Error: ${err.message}`];
  }
}

async function collapse(input) {
  const lowerInput = input.toLowerCase().trim();

  if (lowerInput.startsWith('/read ')) {
    const filePath = lowerInput.slice(6).trim();
    return await fetchFile(filePath);
  }
  if (lowerInput === '/files') {
    const files = await listFiles();
    return `Files in repo:\n${files.join('\n')}`;
  }
  if (lowerInput.includes('hi') || lowerInput.includes('hello')) {
    return "Hi, how can I help you?";
  }
  if (lowerInput.includes('how are you')) {
    return "I'm just a bot, but I'm doing great!";
  }
  if (lowerInput.includes('bye')) {
    return "Goodbye! See you later.";
  }
  return "I don't understand. Try: '/read README.md', '/files', or ask me a question!";
}

console.log("Bot: Hi, how can I help you?");

rl.on('line', async (input) => {
  const reply = await collapse(input);
  console.log(`Bot: ${reply}`);
});

rl.on('close', () => {
  console.log("Bot: Goodbye!");
  process.exit(0);
});