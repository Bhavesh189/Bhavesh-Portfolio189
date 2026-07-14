import html
import time
import httpx
import logging
import asyncio
from datetime import datetime, timezone
from typing import Dict, Any, Optional
import telegram
from telegram import LinkPreviewOptions
from telegram.ext import Application, ContextTypes

import database
import config
from utils import is_status_up, format_status_code

logger = logging.getLogger(__name__)

# Global HTTP client to reuse connections
_client: Optional[httpx.AsyncClient] = None

async def init_http_client() -> None:
    """Initialize the global httpx AsyncClient."""
    global _client
    if _client is None or _client.is_closed:
        # Standard configuration with connection limit pooling
        _client = httpx.AsyncClient(
            timeout=httpx.Timeout(20.0, connect=5.0),
            follow_redirects=True,
            limits=httpx.Limits(max_keepalive_connections=20, max_connections=50)
        )
        logger.info("Scheduler HTTP AsyncClient initialized.")

async def get_http_client() -> httpx.AsyncClient:
    """Retrieve or initialize the active httpx AsyncClient."""
    global _client
    if _client is None or _client.is_closed:
        await init_http_client()
    return _client

async def close_http_client() -> None:
    """Clean up and close the HTTP connection pool."""
    global _client
    if _client is not None and not _client.is_closed:
        await _client.aclose()
        logger.info("Scheduler HTTP AsyncClient closed.")
    _client = None

async def ping_url_once(url_id: int, url: str) -> Dict[str, Any]:
    """
    Perform an async HTTP GET health check for a URL.
    Retries failed attempts up to 3 times before declaring DOWN.
    Updates the database with the results and returns them.
    """
    client = await get_http_client()
    
    # Retrieve configurable timeout from database
    timeout_val = await database.get_setting("ping_timeout", "20")
    try:
        timeout_sec = float(timeout_val)
    except ValueError:
        timeout_sec = 20.0

    max_retries = 3
    status_code = None
    response_time = None
    
    for attempt in range(1, max_retries + 1):
        start_time = time.perf_counter()
        try:
            # Execute GET request overriding default timeout config
            response = await client.get(url, timeout=timeout_sec)
            elapsed = (time.perf_counter() - start_time) * 1000  # in ms
            
            # UP if status is 2xx or 3xx
            if 200 <= response.status_code < 400:
                status_code = response.status_code
                response_time = elapsed
                logger.debug(f"Ping success for {url} on attempt {attempt}: {status_code} ({response_time:.1f}ms)")
                break  # Succeeded, exit retry loop
            else:
                status_code = response.status_code
                response_time = elapsed
                logger.warning(f"Ping failed for {url} on attempt {attempt}: HTTP {status_code}")
                
        except httpx.ConnectTimeout:
            status_code = -1
            logger.warning(f"Connection timeout for {url} on attempt {attempt}")
        except httpx.ReadTimeout:
            status_code = -1
            logger.warning(f"Read timeout for {url} on attempt {attempt}")
        except httpx.TimeoutException:
            status_code = -1
            logger.warning(f"Timeout for {url} on attempt {attempt}")
        except httpx.ConnectError as e:
            err_msg = str(e).lower()
            if "ssl" in err_msg or "cert" in err_msg or "handshake" in err_msg:
                status_code = -3
                logger.warning(f"SSL handshake error for {url} on attempt {attempt}: {e}")
            else:
                status_code = -2
                logger.warning(f"DNS / Connection Error for {url} on attempt {attempt}: {e}")
        except httpx.TransportError as e:
            err_msg = str(e).lower()
            if "ssl" in err_msg or "cert" in err_msg or "handshake" in err_msg:
                status_code = -3
                logger.warning(f"SSL error for {url} on attempt {attempt}: {e}")
            else:
                status_code = -2
                logger.warning(f"Transport error for {url} on attempt {attempt}: {e}")
        except Exception as e:
            status_code = -4
            logger.error(f"Unexpected error pinging {url} on attempt {attempt}: {e}", exc_info=True)
            
        # Wait 1s before retry if attempt fails and has remaining retries
        if attempt < max_retries and not is_status_up(status_code):
            await asyncio.sleep(1.0)
            
    last_ping = datetime.now(timezone.utc).isoformat()
    
    # Save results to SQLite database
    await database.update_url_ping_status(url_id, status_code, response_time, last_ping)
    
    return {
        "status_code": status_code,
        "response_time": response_time,
        "last_ping": last_ping
    }

async def notify_admins(bot: telegram.Bot, text: str) -> None:
    """Send a notification message to all configured admins."""
    for admin_id in config.ADMIN_IDS:
        try:
            await bot.send_message(
                chat_id=admin_id, 
                text=text, 
                parse_mode="HTML",
                link_preview_options=LinkPreviewOptions(is_disabled=True)
            )
        except telegram.error.TelegramError as e:
            logger.error(f"Failed to send alert to admin {admin_id}: {e}")

async def perform_ping_and_alert(bot: telegram.Bot, url_id: int, url: str, previous_status: Optional[int]) -> Dict[str, Any]:
    """Execute ping and send notification alerts to admins if status changes."""
    result = await ping_url_once(url_id, url)
    status_code = result["status_code"]
    response_time = result["response_time"]
    
    current_up = is_status_up(status_code)
    # Treat None as UP initially to ensure failed first ping triggers alert.
    prev_up = is_status_up(previous_status) if previous_status is not None else True
    
    # Check for transitions
    if prev_up and not current_up:
        # Transition UP -> DOWN
        status_str = format_status_code(status_code)
        alert_msg = (
            f"⚠️ <b>Alert: Website is DOWN!</b>\n\n"
            f"🔗 <b>URL:</b> {html.escape(url)}\n"
            f"❌ <b>Status:</b> {status_str}\n"
            f"📅 <b>Time:</b> {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}"
        )
        logger.info(f"ALERT: {url} went DOWN (Status: {status_code})")
        await notify_admins(bot, alert_msg)
        
    elif not prev_up and current_up:
        # Transition DOWN -> UP (Recovery)
        status_str = format_status_code(status_code)
        resp_time_str = f"{response_time:.0f} ms" if response_time else "N/A"
        recovery_msg = (
            f"✅ <b>Recovery: Website is UP!</b>\n\n"
            f"🔗 <b>URL:</b> {html.escape(url)}\n"
            f"🟢 <b>Status:</b> {status_str}\n"
            f"⏱ <b>Response Time:</b> {resp_time_str}\n"
            f"📅 <b>Time:</b> {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}"
        )
        logger.info(f"RECOVERY: {url} came back UP (Status: {status_code})")
        await notify_admins(bot, recovery_msg)
        
    return result

async def ping_url_job(context: ContextTypes.DEFAULT_TYPE) -> None:
    """Job queue callback that checks the health of a URL."""
    url_id = context.job.data
    url_data = await database.get_url(url_id)
    
    if not url_data or not url_data["enabled"]:
        logger.warning(f"URL {url_id} is deleted or disabled. Removing job from queue.")
        context.job.schedule_removal()
        return
        
    await perform_ping_and_alert(
        bot=context.bot,
        url_id=url_id,
        url=url_data["url"],
        previous_status=url_data["last_status"]
    )

def schedule_url(application: Application, url_id: int, url: str, interval: int) -> None:
    """Schedule repeating check jobs for a specific URL."""
    unschedule_url(application, url_id)
    
    if not application.job_queue:
        logger.error("Job queue is not enabled. Cannot schedule URL.")
        return
        
    application.job_queue.run_repeating(
        ping_url_job,
        interval=interval,
        first=5,  # First run in 5 seconds
        name=f"ping_{url_id}",
        data=url_id
    )
    logger.info(f"Scheduled check for URL {url_id} ({url}) every {interval}s")

def unschedule_url(application: Application, url_id: int) -> None:
    """Remove a URL's check jobs from the job queue."""
    if not application.job_queue:
        return
    current_jobs = application.job_queue.get_jobs_by_name(f"ping_{url_id}")
    for job in current_jobs:
        job.schedule_removal()
        logger.info(f"Removed job name ping_{url_id} from queue.")

async def start_monitoring(application: Application) -> None:
    """Enable global monitoring and schedule all active URL jobs."""
    await database.set_setting("monitoring_active", "true")
    enabled_urls = await database.get_enabled_urls()
    for item in enabled_urls:
        schedule_url(application, item["id"], item["url"], item["interval"])
    logger.info("Global monitoring started. All enabled URLs scheduled.")

async def stop_monitoring(application: Application) -> None:
    """Disable global monitoring and clear all scheduled jobs."""
    await database.set_setting("monitoring_active", "false")
    if application.job_queue:
        for job in list(application.job_queue.jobs()):
            if job.name and job.name.startswith("ping_"):
                job.schedule_removal()
    logger.info("Global monitoring stopped. All scheduled jobs removed.")

async def init_scheduler(application: Application) -> None:
    """Schedule jobs on startup if global monitoring is active."""
    await init_http_client()
    monitoring_active = await database.get_setting("monitoring_active", "true")
    if monitoring_active == "true":
        logger.info("Initialization: Global monitoring is active. Scheduling URLs...")
        enabled_urls = await database.get_enabled_urls()
        for item in enabled_urls:
            schedule_url(application, item["id"], item["url"], item["interval"])
    else:
        logger.info("Initialization: Global monitoring is inactive.")
