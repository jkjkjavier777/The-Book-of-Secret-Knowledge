#!/usr/bin/env python3
import json
import os
import random
import sys
from datetime import datetime

# --- Config & Knowledge Base ---
CONFIG_PATH = "bot.json"
QUOTES_PATH = "data/quotes.json"
REPLIES_PATH = "data/replies.json"
HISTORY_PATH = "bot_output.log"

def load_config():
    with open(CONFIG_PATH, "r") as f:
        return json.load(f)

def load_quotes():
    with open(QUOTES_PATH, "r") as f:
        return json.load(f)

def load_replies():
    with open(REPLIES_PATH, "r") as f:
        return json.load(f)

def load_history():
    if not os.path.exists(HISTORY_PATH):
        return []
    with open(HISTORY_PATH, "r") as f:
        return [line.split(" → ")[0].split(": ")[1].strip("'") for line in f.readlines()]

# --- Reward Engine ---
def calculate_reward(user_input, history):
    config = load_config()
    R = config["rewards"]["question"]
    P = 0
    if user_input in history:
        P = config["rewards"]["repeat_penalty"]
    return R - P

# --- Response Generation ---
def collapse(text, replies):
    key = text.strip().lower()
    options = replies.get(key)
    if not options:
        return random.choice([
            "The archive hums but finds no entangled reply...",
            "12.123: Your query is in an undefined state.",
            "The Book of Secret Knowledge remains silent."
        ])
    return random.choice(options)

def generate_response(user_input):
    config = load_config()
    quotes = load_quotes()
    replies = load_replies()
    history = load_history()

    # Calculate reward
    R_prime = calculate_reward(user_input, history)

    # Log interaction
    log_interaction(user_input, R_prime)

    # Generate response
    responses = [
        f"The archive opens its mouth wider than the event horizon... Your reward: {R_prime}.",
        f"Entropy answers in static. {random.choice(quotes)['quote']} — {random.choice(quotes)['author']}",
        f"JVI: {collapse(user_input, replies)} (R' = {R_prime})"
    ]
    return random.choice(responses)

def log_interaction(user_input, R_prime):
    with open(HISTORY_PATH, "a") as f:
        f.write(f"{datetime.now()}: User asked '{user_input}' → R' = {R_prime}\n")

# --- Main ---
def main():
    replies = load_replies()
    print("JVI: Hi. I am JVI, the Adaptive Alpha Engine. Type a message, or 'exit' to quit.\n")

    # One-shot mode: python bot.py "how are you?"
    if len(sys.argv) > 1:
        message = " ".join(sys.argv[1:])
        print(f"> {message}")
        print(generate_response(message))
        return

    # Interactive loop mode: python bot.py
    while True:
        try:
            text = input("> ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nJVI: Collapsing to |offline⟩. Bye.")
            break

        if text.lower() in ("exit", "quit"):
            print("JVI: Collapsing to |offline⟩. Bye.")
            break
        if not text:
            continue

        print("JVI: " + generate_response(text) + "\n")

if __name__ == "__main__":
    main()