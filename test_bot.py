#!/usr/bin/env python3
import json

# Test loading replies.json
try:
    with open("data/replies.json", "r") as f:
        replies = json.load(f)
    print("✅ replies.json loaded successfully!")
    print(f"Example reply: {replies.get('hi', ['No reply found.'])[0]}")
except FileNotFoundError:
    print("❌ Error: data/replies.json not found. Check the path.")
except json.JSONDecodeError:
    print("❌ Error: data/replies.json is not valid JSON.")
