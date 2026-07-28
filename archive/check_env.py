from dotenv import load_dotenv
import os

load_dotenv()

print("🔐 Token Status:")
for key in ["OPENAI_API_KEY", "TELEGRAM_BOT_TOKEN", "DISCORD_BOT_TOKEN", "BOT_NAME"]:
    val = os.getenv(key)
    status = "✅ SET" if val else "❌ MISSING"
    # Mask the actual value for safety
    display = val[:8] + "..." + val[-4:] if val and len(val) > 12 else val
    print(f"  {key}: {status} ({display if val else 'none'})")

