# Quantum Chatbot with Mistral AI

A simple, elegant chatbot powered by Mistral AI's LeChat API.

## Features

- Dark-themed quantum-inspired UI
- Real-time chat with Mistral AI
- Secure backend architecture (API key never exposed to client)
- Easy setup and deployment

## Setup

### 1. Clone the repository
```bash
git clone https://github.com/jkjkjavier777/The-Book-of-Secret-Knowledge.git
cd The-Book-of-Secret-Knowledge
```

### 2. Get a Mistral API Key
1. Go to [console.mistral.ai](https://console.mistral.ai)
2. Sign up with email, GitHub, or other method
3. Verify your phone number (free tier available)
4. Navigate to **API Keys** and click **Create new key**
5. Copy the key immediately (you won't see it again)

### 3. Install dependencies
```bash
npm install
```

### 4. Create `.env` file
Copy `.env.example` to `.env` and add your API key:
```
MISTRAL_API_KEY=your_actual_api_key_here
PORT=3000
```

**⚠️ Important:** Never commit `.env` to git. It's already in `.gitignore`.

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

- **Frontend** (`site/index.html`): Vue-like HTML/JS chatbot UI
- **Backend** (`server.js`): Node.js/Express server that securely holds the API key and proxies requests to Mistral
- **Security**: API key stays on the server, never exposed in browser

## Deployment

### Deploy to Heroku
```bash
git push heroku main
```
Make sure to set the `MISTRAL_API_KEY` environment variable in Heroku dashboard.

### Deploy to Vercel (Serverless)
Vercel has limitations for long-running servers. For production, prefer platforms like Heroku, Railway, or DigitalOcean.

### Deploy to Railway
1. Connect your GitHub repo at [railway.app](https://railway.app)
2. Add `MISTRAL_API_KEY` environment variable
3. Railway auto-deploys on push

## License

MIT
