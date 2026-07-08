const readline = require('readline');
const https = require('https');

// ── Repo config ────────────────────────────────────────
const REPO_OWNER = 'jkjkjavier777';
const REPO_NAME = 'The-Book-of-Secret-Knowledge';
const BRANCH = 'main';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // set via: export GITHUB_TOKEN="..."

// ── Low-level GitHub request helper ────────────────────
function githubRequest(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      method,
      hostname: 'api.github.com',
      path: urlPath,
      headers: {
        'User-Agent': 'termux-repo-bot',
        'Accept': 'application/vnd.github+json',
        ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
        ...(payload ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data ? JSON.parse(data) : {});
        } else {
          reject(new Error(`GitHub API ${res.statusCode}: ${data.slice(0, 300)}`));
        }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

// ── Read-only helpers (via raw.githubusercontent, no auth needed for public repo) ──
function rawGet(filePath) {
  const url = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${filePath}`;
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'termux-repo-bot' } }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve(data);
        else reject(new Error(`raw.githubusercontent ${res.statusCode}`));
      });
    }).on('error', reject);
  });
}

async function readGithubFile(filePath) {
  try {
    return await rawGet(filePath);
  } catch (err) {
    return `Error: Could not read ${filePath} — ${err.message}`;
  }
}

async function listGithubFiles(dir = '') {
  try {
    const items = await githubRequest('GET', `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${dir}?ref=${BRANCH}`);
    if (!Array.isArray(items)) return [`Error: ${items.message || 'unexpected response'}`];
    return items.map((item) => (item.type === 'dir' ? `${item.path}/` : item.path));
  } catch (err) {
    return [`Error: Could not list ${dir || '/'} — ${err.message}`];
  }
}

// ── Write helper (requires GITHUB_TOKEN with repo scope) ───────────────
async function commitFileEdit(filePath, newContent, commitMessage) {
  if (!GITHUB_TOKEN) {
    return 'Error: GITHUB_TOKEN is not set. Run: export GITHUB_TOKEN="your-personal-access-token"';
  }
  try {
    // Get current file to retrieve its sha (required for updates)
    const current = await githubRequest('GET', `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}?ref=${BRANCH}`);
    const payload = {
      message: commitMessage || `Update ${filePath} via bot`,
      content: Buffer.from(newContent, 'utf8').toString('base64'),
      sha: current.sha,
      branch: BRANCH,
    };
    const result = await githubRequest('PUT', `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`, payload);
    return `Committed successfully: ${result.commit && result.commit.sha ? result.commit.sha.slice(0, 7) : 'ok'}`;
  } catch (err) {
    return `Error committing ${filePath}: ${err.message}`;
  }
}

// ── Pending-edit confirmation state ────────────────────
let pendingEdit = null; // { filePath, newContent }

// ── Command handling ───────────────────────────────────
async function collapse(input) {
  const lower = input.toLowerCase().trim();

  // Confirmation gate for a pending edit
  if (pendingEdit) {
    if (lower === 'yes') {
      const { filePath, newContent } = pendingEdit;
      pendingEdit = null;
      return await commitFileEdit(filePath, newContent);
    } else {
      pendingEdit = null;
      return 'Edit cancelled.';
    }
  }

  if (lower.startsWith('/read ')) {
    return await readGithubFile(input.slice(6).trim());
  }
  if (lower === '/files' || lower.startsWith('/files ')) {
    const dir = lower.startsWith('/files ') ? input.slice(7).trim() : '';
    const files = await listGithubFiles(dir);
    return `Files in ${REPO_OWNER}/${REPO_NAME}${dir ? '/' + dir : ''}:\n${files.join('\n')}`;
  }
  if (lower.startsWith('/edit ')) {
    // Usage: /edit path/to/file.md :: new full file content goes here
    const rest = input.slice(6);
    const sepIndex = rest.indexOf('::');
    if (sepIndex === -1) {
      return "Usage: /edit <filePath> :: <new file content>  (content replaces the whole file)";
    }
    const filePath = rest.slice(0, sepIndex).trim();
    const newContent = rest.slice(sepIndex + 2).trim();
    pendingEdit = { filePath, newContent };
    return `About to overwrite "${filePath}" on branch "${BRANCH}" with new content (${newContent.length} chars). Type "yes" to confirm, or anything else to cancel.`;
  }
  if (lower.includes('hi') || lower.includes('hello')) return 'Hi, how can I help you?';
  if (lower.includes('how are you')) return "I'm just a bot, but I'm doing great!";
  if (lower.includes('bye')) return 'Goodbye! See you later.';

  return "I don't understand. Try: '/read README.md', '/files', '/files descriptors', or '/edit path :: new content'.";
}

// ── Chat loop ──────────────────────────────────────────
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
console.log(`Bot: Hi, how can I help you? (repo: ${REPO_OWNER}/${REPO_NAME}, writes ${GITHUB_TOKEN ? 'ENABLED' : 'disabled — no GITHUB_TOKEN set'})`);

rl.on('line', async (input) => {
  const reply = await collapse(input);
  console.log(`Bot: ${reply}`);
});

rl.on('close', () => {
  console.log('Bot: Goodbye!');
  process.exit(0);
});
