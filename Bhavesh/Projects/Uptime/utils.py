import re
import json
from urllib.parse import urlparse
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List

def validate_url(url: str) -> bool:
    """Validate that the string is a well-formed HTTP or HTTPS URL."""
    if not url:
        return False
    try:
        parsed = urlparse(url)
        # Ensure it has a scheme, netloc (domain), and the scheme is http or https
        if parsed.scheme not in ("http", "https"):
            return False
        if not parsed.netloc:
            return False
        # Regex check to ensure netloc contains at least a dot and a valid domain format
        if not re.match(r"^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", parsed.netloc):
            return False
        return True
    except Exception:
        return False

def normalize_url(url: str) -> str:
    """
    Normalize website URLs to avoid duplicate configurations (e.g. trailing slash variants).
    Converts domain to lowercase and strips trailing slash on main hostnames.
    """
    if not url:
        return ""
    try:
        url = url.strip()
        parsed = urlparse(url)
        scheme = parsed.scheme.lower()
        netloc = parsed.netloc.lower()
        path = parsed.path
        if path == "/":
            path = ""
            
        query = parsed.query
        fragment = parsed.fragment
        
        reconstructed = f"{scheme}://{netloc}{path}"
        if query:
            reconstructed += f"?{query}"
        if fragment:
            reconstructed += f"#{fragment}"
        return reconstructed
    except Exception:
        return url

def format_time_ago(iso_timestamp: Optional[str]) -> str:
    """Convert an ISO UTC timestamp into a human-readable 'time ago' format."""
    if not iso_timestamp:
        return "Never"
    
    try:
        dt = datetime.fromisoformat(iso_timestamp)
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        
        now = datetime.now(timezone.utc)
        diff = now - dt
        seconds = int(diff.total_seconds())
        
        if seconds < 5:
            return "just now"
        if seconds < 60:
            return f"{seconds} seconds ago"
        
        minutes = seconds // 60
        if minutes < 60:
            return f"{minutes}m ago"
            
        hours = minutes // 60
        if hours < 24:
            return f"{hours}h ago"
            
        days = hours // 24
        return f"{days}d ago"
    except Exception:
        return "Unknown"

def format_status_code(code: Optional[int]) -> str:
    """Return a nice formatted status code description with emoji."""
    if code is None:
        return "Not Pinged Yet"
        
    if code == -1:
        return "🔴 Timeout"
    elif code == -2:
        return "🔴 DNS / Network Error"
    elif code == -3:
        return "🔴 SSL Error"
    elif code == -4:
        return "🔴 Unknown Error"
    elif 200 <= code < 400:
        return f"🟢 {code} OK"
    else:
        return f"🔴 {code} Error"

def is_status_up(code: Optional[int]) -> bool:
    """Helper to check if a status code implies the site is UP."""
    if code is None:
        return True  # Avoid alerting if we haven't checked it yet
    return 200 <= code < 400

def export_to_json(urls: List[Dict[str, Any]]) -> str:
    """Export URLs to JSON format containing only URL and interval configuration."""
    clean_urls = []
    for item in urls:
        clean_urls.append({
            "url": item["url"],
            "interval": item["interval"],
            "enabled": bool(item["enabled"])
        })
    return json.dumps(clean_urls, indent=2)

def parse_import_json(json_str: str) -> List[Dict[str, Any]]:
    """Parse JSON string for importing URLs. Returns list of valid config dicts."""
    try:
        data = json.loads(json_str)
        if not isinstance(data, list):
            raise ValueError("Root element must be a list of URL objects.")
            
        valid_imports = []
        for index, item in enumerate(data):
            if not isinstance(item, dict) or "url" not in item:
                continue
                
            url = item["url"]
            if not validate_url(url):
                continue
                
            interval = item.get("interval", 30)
            if not isinstance(interval, int) or interval <= 0:
                interval = 30
                
            enabled = item.get("enabled", True)
            if not isinstance(enabled, bool):
                enabled = True
                
            valid_imports.append({
                "url": url,
                "interval": interval,
                "enabled": enabled
            })
        return valid_imports
    except Exception as e:
        raise ValueError(f"JSON Parsing Error: {str(e)}")
