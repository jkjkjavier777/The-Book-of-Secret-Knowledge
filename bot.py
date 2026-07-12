#!/usr/bin/env python3
# Filename: scripts/bot.py
import json
import os
import random
import sys

REPLIES_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "replies.json")

def load_replies():
    with open(REPLIES_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def collapse(text, replies):
    key = text.strip().lower()
    options = replies.get(key)
    if not options:
        return "No entangled reply found for that input yet — still in an undefined state."
    return random.choice(options)

def main():
    replies = load_replies()

    # One-shot mode: python bot.py "how are you?"
    if len(sys.argv) > 1:
        message = " ".join(sys.argv[1:])
        print(f"> {message}")
        print(collapse(message, replies))
        return

    # Interactive loop mode: python bot.py
    print('JVI: hi. I am JVI. Type a message, or "exit" to quit.\n')
    while True:
        try:
            text = input("> ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nJVI: collapsing to |offline⟩. Bye.")
            break

        if text.lower() in ("exit", "quit"):
            print("JVI: collapsing to |offline⟩. Bye.")
            break
        if not text:
            continue

        print("JVI: " + collapse(text, replies) + "\n")

if __name__ == "__main__":
    main()

