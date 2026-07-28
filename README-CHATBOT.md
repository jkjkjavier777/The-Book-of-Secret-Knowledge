# Quantum Chatbot with Claude

A simple, elegant chatbot powered by Anthropic's Claude API.

## Features

- Dark-themed quantum-inspired UI
- Real-time chat with Claude
- Secure backend architecture (API key never exposed to client)
- Easy setup and deployment

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/jkjkjavier777/The-Book-of-Secret-Knowledge.git
cd The-Book-of-Secret-Knowledge
```

### 2. Get an Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up with email or Google
3. Verify your account
4. Navigate to **API Keys** and click **Create Key**
5. Copy the key immediately (you won't see it again)
6. New accounts get a small amount of free credit to start — after that, usage is billed per token. There is no ongoing free tier for the API itself.

### 3. Install dependencies

```bash
npm install
```

### 4. Create `.env` file

Copy `.env.example` to `.env` and add your API key:

```
ANTHROPIC_API_KEY=your_actual_api_key_here
PORT=3000
```

**Important:** Never commit `.env` to git. It's already in `.gitignore`.

### 5. Run the server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The chatbot will be available at `http://localhost:3000`

## Architecture

- **Frontend** (`site/index.html`): HTML/JS chatbot UI
- **Backend** (`server.js`): Node.js/Express server that securely holds the API key and proxies requests to the Anthropic API
- **Security**: API key stays on the server, never exposed in browser

## Deployment

### Deploy to Heroku

```bash
git push heroku main
```

Set the `ANTHROPIC_API_KEY` environment variable in the Heroku dashboard.

### Deploy to Vercel (Serverless)

Vercel has limitations for long-running servers. For production, prefer platforms like Heroku, Railway, or DigitalOcean.

### Deploy to Railway

1. Connect your GitHub repo at [railway.app](https://railway.app)
2. Add `ANTHROPIC_API_KEY` environment variable
3. Railway auto-deploys on push

## License

MIT
