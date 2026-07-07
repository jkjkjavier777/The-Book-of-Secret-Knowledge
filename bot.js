const readline = require('readline');
const fetch = require('node-fetch');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const jkjkjavier777 = 'your-username';
const GITHUB_REPO = 'the-book-of-secret-knowledge';
const GITHUB_API_BASE = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/`;
const GITHUB_TOKEN = 'your-github-token'; // Optional for private repos

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
      return Buffer.from(data.content, 'base64').toString('utf8');
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