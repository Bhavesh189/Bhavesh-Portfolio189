import os
import sys
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN", "")
ADMIN_IDS_STR = os.getenv("ADMIN_IDS", "")

# Parse admin IDs as a set of integers for faster lookup
ADMIN_IDS = set()
if ADMIN_IDS_STR:
    for item in ADMIN_IDS_STR.split(","):
        try:
            ADMIN_IDS.add(int(item.strip()))
        except ValueError:
            print(f"Warning: Invalid admin ID in .env: {item}", file=sys.stderr)

# Database path and configuration defaults
DB_PATH = os.getenv("DB_PATH", "data/uptime.db")
DEFAULT_INTERVAL = int(os.getenv("DEFAULT_INTERVAL", "30"))  # Default 30 seconds

# Create essential directories
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
os.makedirs("logs", exist_ok=True)
