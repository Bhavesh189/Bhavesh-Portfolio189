import aiosqlite
from contextlib import asynccontextmanager
from typing import List, Dict, Any, Optional
from config import DB_PATH

@asynccontextmanager
async def get_db_connection():
    """
    Asynchronously get a database connection context manager.
    Ensures correct thread lifecycle and sets WAL mode for concurrency.
    """
    async with aiosqlite.connect(DB_PATH, timeout=30.0) as db:
        db.row_factory = aiosqlite.Row
        await db.execute("PRAGMA journal_mode=WAL")
        await db.execute("PRAGMA synchronous=NORMAL")
        yield db

async def init_db() -> None:
    """Initialize the database tables and default settings."""
    async with get_db_connection() as db:
        # Create URLs table
        await db.execute("""
            CREATE TABLE IF NOT EXISTS urls (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                url TEXT UNIQUE NOT NULL,
                enabled INTEGER DEFAULT 1,
                interval INTEGER DEFAULT 30,
                last_ping TEXT,
                last_status INTEGER,
                response_time REAL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create Settings table
        await db.execute("""
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT UNIQUE NOT NULL,
                value TEXT
            )
        """)
        
        # Insert default settings if they do not exist
        await db.execute(
            "INSERT OR IGNORE INTO settings (key, value) VALUES ('monitoring_active', 'true')"
        )
        await db.commit()

async def add_url(url: str, interval: int = 30) -> int:
    """Add a new URL to monitor."""
    async with get_db_connection() as db:
        cursor = await db.execute(
            "INSERT INTO urls (url, interval) VALUES (?, ?)", (url, interval)
        )
        await db.commit()
        return cursor.lastrowid

async def get_url(url_id: int) -> Optional[Dict[str, Any]]:
    """Retrieve details of a single URL by ID."""
    async with get_db_connection() as db:
        async with db.execute("SELECT * FROM urls WHERE id = ?", (url_id,)) as cursor:
            row = await cursor.fetchone()
            return dict(row) if row else None

async def get_url_by_url(url: str) -> Optional[Dict[str, Any]]:
    """Retrieve details of a single URL by its address."""
    async with get_db_connection() as db:
        async with db.execute("SELECT * FROM urls WHERE url = ?", (url,)) as cursor:
            row = await cursor.fetchone()
            return dict(row) if row else None

async def get_all_urls() -> List[Dict[str, Any]]:
    """Retrieve all URLs in the database."""
    async with get_db_connection() as db:
        async with db.execute("SELECT * FROM urls ORDER BY id DESC") as cursor:
            rows = await cursor.fetchall()
            return [dict(row) for row in rows]

async def get_enabled_urls() -> List[Dict[str, Any]]:
    """Retrieve all active/enabled URLs."""
    async with get_db_connection() as db:
        async with db.execute("SELECT * FROM urls WHERE enabled = 1") as cursor:
            rows = await cursor.fetchall()
            return [dict(row) for row in rows]

async def search_urls(query: Optional[str] = None, limit: int = 5, offset: int = 0) -> List[Dict[str, Any]]:
    """Search URLs with pagination."""
    async with get_db_connection() as db:
        if query:
            sql = "SELECT * FROM urls WHERE url LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?"
            params = (f"%{query}%", limit, offset)
        else:
            sql = "SELECT * FROM urls ORDER BY id DESC LIMIT ? OFFSET ?"
            params = (limit, offset)
            
        async with db.execute(sql, params) as cursor:
            rows = await cursor.fetchall()
            return [dict(row) for row in rows]

async def get_urls_count(query: Optional[str] = None) -> int:
    """Get the total count of URLs matching search filter."""
    async with get_db_connection() as db:
        if query:
            sql = "SELECT COUNT(*) as count FROM urls WHERE url LIKE ?"
            params = (f"%{query}%",)
        else:
            sql = "SELECT COUNT(*) as count FROM urls"
            params = ()
            
        async with db.execute(sql, params) as cursor:
            row = await cursor.fetchone()
            return row["count"] if row else 0

async def update_url_ping_status(url_id: int, status: int, response_time: Optional[float], last_ping: str) -> None:
    """Update URL monitoring results after ping."""
    async with get_db_connection() as db:
        await db.execute(
            """UPDATE urls 
               SET last_status = ?, response_time = ?, last_ping = ? 
               WHERE id = ?""",
            (status, response_time, last_ping, url_id)
        )
        await db.commit()

async def update_url_enabled(url_id: int, enabled: bool) -> None:
    """Toggle a URL status (enabled or disabled)."""
    async with get_db_connection() as db:
        await db.execute(
            "UPDATE urls SET enabled = ? WHERE id = ?",
            (1 if enabled else 0, url_id)
        )
        await db.commit()

async def update_url_interval(url_id: int, interval: int) -> None:
    """Change the ping interval for a specific URL."""
    async with get_db_connection() as db:
        await db.execute(
            "UPDATE urls SET interval = ? WHERE id = ?",
            (interval, url_id)
        )
        await db.commit()

async def delete_url(url_id: int) -> None:
    """Remove a URL from monitoring database."""
    async with get_db_connection() as db:
        await db.execute("DELETE FROM urls WHERE id = ?", (url_id,))
        await db.commit()

async def get_setting(key: str, default: Optional[str] = None) -> Optional[str]:
    """Get custom bot setting value."""
    async with get_db_connection() as db:
        async with db.execute("SELECT value FROM settings WHERE key = ?", (key,)) as cursor:
            row = await cursor.fetchone()
            return row["value"] if row else default

async def set_setting(key: str, value: str) -> None:
    """Set or update a custom bot setting."""
    async with get_db_connection() as db:
        await db.execute(
            "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)",
            (key, value)
        )
        await db.commit()
