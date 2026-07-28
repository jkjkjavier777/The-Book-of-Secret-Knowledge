#!/usr/bin/env python3
import os
import json
import random
import sys
import re
from datetime import datetime
from dotenv import load_dotenv

# Load .env
load_dotenv()

# ============ EXPOSE TOKENS ============
MISTRAL_API_KEY = os.getenv("cRI0FTqjYWMHhShsodIGnaHxvhtbtHpZ")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
DISCORD_BOT_TOKEN = os.getenv("DISCORD_BOT_TOKEN")
BOT_NAME = os.getenv("BOT_NAME", "JVI")
LEARNING_MODE = os.getenv("LEARNING_MODE", "false").lower() == "true"

if not MISTRAL_API_KEY:
    print("⚠️  Warning: MISTRAL_API_KEY not set in .env — bot will run in local/echo mode")
# =======================================

# --- Mistral Client (lazy init) ---
_mistral_client = None

def get_mistral_client():
    global _mistral_client
    if _mistral_client is None and MISTRAL_API_KEY:
        try:
            from mistralai import Mistral
            _mistral_client = Mistral(api_key=MISTRAL_API_KEY)
        except ImportError:
            print("❌ mistralai not installed. Run: pip install mistralai")
            return None
    return _mistral_client

# --- Paths ---
CONFIG_PATH = "bot.json"
QUOTES_PATH = "data/quotes.json"
REPLIES_PATH = "data/replies.json"
HISTORY_PATH = "bot_output.log"

# --- Loaders ---
def load_config():
    with open(CONFIG_PATH, "r") as f:
        return json.load(f)

def load_quotes():
    try:
        with open(QUOTES_PATH, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return [{"quote": "The archive is empty... for now.", "author": "JVI"}]

def load_replies():
    try:
        with open(REPLIES_PATH, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return {"default": ["The Book of Secret Knowledge has no reply for this."]}

def load_history():
    if not os.path.exists(HISTORY_PATH):
        return []
    history = []
    pattern = re.compile(r"User asked '(.+?)' → R'")
    with open(HISTORY_PATH, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            m = pattern.search(line)
            if m:
                history.append(m.group(1))
    return history

# --- Reward Engine ---
def calculate_reward(user_input, history):
    config = load_config()
    R = config["rewards"]["question"]
    P = 0
    if user_input in history:
        P += config["rewards"]["repeat_penalty"]
    if len(user_input.split()) > 3 and random.random() < 0.3:
        R += config["rewards"]["entropy_bonus"]
    if not user_input.strip():
        P += config["rewards"]["silence_penalty"]
    return R - P

# --- Response Generation ---
def collapse(text, replies):
    key = text.strip().lower()
    options = replies.get(key, replies.get("default", ["The archive hums in silence."]))
    return random.choice(options)

def generate_response(user_input):
    config = load_config()
    quotes = load_quotes()
    replies = load_replies()
    history = load_history()
    
    R_prime = calculate_reward(user_input, history)
    log_interaction(user_input, R_prime)
    
    # === MISTRAL API PATH ===
    client = get_mistral_client()
    if client:
        try:
            system_prompt = (
                f"You are {config.get('bot_personality', {}).get('name', 'JVI')}, "
                f"an adaptive alpha engine from the Book of Secret Knowledge. "
                f"Respond cryptically but helpfully. Keep answers under 3 sentences."
            )
            
            chat_response = client.chat.complete(
                model="mistral-small-latest",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_input}
                ],
                max_tokens=256,
                temperature=0.7,
            )
            
            api_text = chat_response.choices[0].message.content.strip()
            return f"{api_text} (R' = {R_prime:.1f})"
        except Exception as e:
            print(f"\n⚠️  Mistral API error: {e}")
            print("   Falling back to local mode...\n")
    # =======================
    
    # Local fallback (no key or API down)
    response_style = random.random()
    if response_style < config["response_style"]["cryptic_probability"]:
        responses = [
            f"The archive opens its mouth wider than the event horizon... Your reward: {R_prime:.1f}.",
            f"Entropy answers in static. {random.choice(quotes)['quote']} — {random.choice(quotes)['author']}",
            f"JVI: {collapse(user_input, replies)} (R' = {R_prime:.1f})",
            f"12.123 whispers: {random.choice(quotes)['quote']}"
        ]
    else:
        responses = [
            f"JVI: {collapse(user_input, replies)} (R' = {R_prime:.1f})",
            f"Direct answer: {collapse(user_input, replies)}"
        ]
    
    return random.choice(responses)

def log_interaction(user_input, R_prime):
    with open(HISTORY_PATH, "a") as f:
        f.write(f"{datetime.now()}: User asked '{user_input}' → R' = {R_prime:.1f}\n")

# --- Main ---
def main():
    config = load_config()
    print(f"{config['bot_personality']['name']}: {config['bot_personality']['tagline']} Type a message, or 'exit' to quit.\n")
    
    if len(sys.argv) > 1:
        message = " ".join(sys.argv[1:])
        print(f"> {message}")
        print(generate_response(message))
        return
    
    while True:
        try:
            text = input("> ").strip()
        except (EOFError, KeyboardInterrupt):
            print(f"\n{config['bot_personality']['name']}: Collapsing to |offline|. Bye.")
            break
        
        if text.lower() in ("exit", "quit"):
            print(f"{config['bot_personality']['name']}: Collapsing to |offline|. Bye.")
            break
        
        if not text:
            print(f"{config['bot_personality']['name']}: Silence is not an option. (R' = {config['rewards']['silence_penalty']})\n")
            continue
        
        print(f"{config['bot_personality']['name']}: " + generate_response(text) + "\n")

if __name__ == "__main__":
    main()

