#!/usr/bin/env python3
"""test.py — Diagnostic script for JVI bot"""

import os
import json
import re
from dotenv import load_dotenv

load_dotenv()

print("=" * 50)
print("  JVI BOT DIAGNOSTIC")
print("=" * 50)

# 1. ENV
print("\n[TOKENS]")
for k in ["OPENAI_API_KEY", "TELEGRAM_BOT_TOKEN", "DISCORD_BOT_TOKEN", "BOT_NAME", "LEARNING_MODE"]:
    v = os.getenv(k, "NOT SET")
    status = "✅" if v and v != "NOT SET" else "⚠️"
    display = v[:8] + "..." + v[-4:] if v and len(v) > 12 else v
    print(f"  {status} {k}: {display}")

# 2. FILES
print("\n[FILES]")
for f in ["bot.json", "data/quotes.json", "data/replies.json", "bot_output.log", "bot.log"]:
    if os.path.exists(f):
        print(f"  ✅ {f} ({os.path.getsize(f)} bytes)")
    else:
        print(f"  ❌ {f} MISSING")

# 3. CONFIG
print("\n[CONFIG]")
try:
    with open("bot.json") as f:
        c = json.load(f)
    print(f"  ✅ Valid JSON")
    print(f"     Name: {c.get('bot_personality',{}).get('name','?')}")
    print(f"     Tagline: {c.get('bot_personality',{}).get('tagline','?')}")
except Exception as e:
    print(f"  ❌ {e}")

# 4. HISTORY PARSE TEST
print("\n[HISTORY PARSE]")
HISTORY_PATH = "bot_output.log"
history = []
if os.path.exists(HISTORY_PATH):
    pattern = re.compile(r"User asked '(.+?)' → R'")
    with open(HISTORY_PATH, "r", encoding="utf-8") as f:
        for line in f:
            m = pattern.search(line)
            if m:
                history.append(m.group(1))
    print(f"  ✅ Extracted {len(history)} inputs from bot_output.log")
    if history:
        print(f"     Latest: '{history[-1]}'")
else:
    print(f"  ⚠️  {HISTORY_PATH} not found")

# 5. BOT IMPORT TEST
print("\n[BOT FUNCTIONS]")
try:
    from bot import generate_response, calculate_reward, load_history
    print("  ✅ Imports successful")
    test_resp = generate_response("test")
    print(f"  ✅ generate_response('test') = '{test_resp[:50]}...'")
except Exception as e:
    print(f"  ❌ {type(e).__name__}: {e}")

print("\n" + "=" * 50)

