import os
import logging
import sys
import threading
from http.server import SimpleHTTPRequestHandler, HTTPServer
from logging.handlers import RotatingFileHandler
from telegram import Update
from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    CallbackQueryHandler,
    MessageHandler,
    ConversationHandler,
    ContextTypes,
    filters
)

import config
import database
import scheduler
import handlers
from handlers.admin import admin_only

# Create log directories and configure RotatingFileHandler
os.makedirs("logs", exist_ok=True)
rotating_handler = RotatingFileHandler(
    "logs/bot.log",
    maxBytes=5 * 1024 * 1024,  # 5 MB
    backupCount=5,
    encoding="utf-8"
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        rotating_handler,
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Validate that the BOT_TOKEN is present
if not config.BOT_TOKEN or config.BOT_TOKEN == "your_telegram_bot_token_here":
    logger.critical("BOT_TOKEN is missing or not configured in .env. Exiting.")
    sys.exit("Error: BOT_TOKEN is not set.")

if not config.ADMIN_IDS:
    logger.warning("ADMIN_IDS is empty. Nobody will be authorized to use this bot!")

# ----------------------------------------------------
# 1. Custom Command Wrappers for /commands
# ----------------------------------------------------

@admin_only
async def cmd_start_monitor(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Command /startmonitor - Enables the global ping job queue scheduler."""
    await scheduler.start_monitoring(context.application)
    await update.message.reply_text("▶️ *Global monitoring scheduler is now active!*\nHealth checks are running for all enabled URLs.", parse_mode="Markdown")

@admin_only
async def cmd_stop_monitor(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Command /stopmonitor - Disables the global ping job queue scheduler."""
    await scheduler.stop_monitoring(context.application)
    await update.message.reply_text("⏹ *Global monitoring scheduler is now stopped.*\nBackground health checks are paused.", parse_mode="Markdown")

# ----------------------------------------------------
# 2. Error Handler
# ----------------------------------------------------

async def global_error_handler(update: object, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Log exceptions and notify admins of critical failures."""
    logger.error("Exception occurred while handling an update:", exc_info=context.error)
    
    if isinstance(update, Update) and update.effective_chat:
        try:
            await context.bot.send_message(
                chat_id=update.effective_chat.id,
                text="❌ *An internal error occurred.*\nThe details have been written to the logs. Please try again later.",
                parse_mode="Markdown"
            )
        except Exception as e:
            logger.error(f"Failed to send error notification to chat: {e}")

# ----------------------------------------------------
# 3. Post Initialization (DB & Schedules)
# ----------------------------------------------------

async def post_init(application) -> None:
    """Run DB setup and schedule initial monitor jobs on startup."""
    logger.info("Initializing SQLite Database...")
    await database.init_db()
    
    logger.info("Initializing Background Job Scheduler...")
    await scheduler.init_scheduler(application)
    
    logger.info("Bot is fully initialized and listening for requests.")

# ----------------------------------------------------
# 4. Post Shutdown (Cleanups)
# ----------------------------------------------------

async def post_shutdown(application) -> None:
    """Perform post shutdown cleanup operations (like closing connections)."""
    logger.info("Executing post-shutdown database & HTTP client cleanups...")
    await scheduler.close_http_client()
    logger.info("Post-shutdown cleanup complete.")

def start_health_server() -> None:
    """Start a simple HTTP server to handle health checks (e.g. for Render)."""
    port = int(os.getenv("PORT", "8000"))
    
    class HealthHandler(SimpleHTTPRequestHandler):
        def do_GET(self):
            if self.path in ("/", "/health"):
                self.send_response(200)
                self.send_header("Content-Type", "text/plain")
                self.end_headers()
                self.wfile.write(b"OK")
            else:
                self.send_response(404)
                self.end_headers()

        def log_message(self, format, *args):
            # Suppress default stdout log messages from HTTP server to avoid logs noise
            pass

    try:
        server = HTTPServer(("0.0.0.0", port), HealthHandler)
        logger.info(f"Health check HTTP server listening on port {port}")
        server.serve_forever()
    except Exception as e:
        logger.error(f"Failed to start health check HTTP server: {e}")

# ----------------------------------------------------
# 5. Main Event Loop Setup
# ----------------------------------------------------

def main() -> None:
    """Build and launch the Telegram bot application."""
    # Start background health check HTTP server if PORT env is set
    if os.getenv("PORT"):
        threading.Thread(target=start_health_server, daemon=True).start()

    logger.info("Starting Telegram Bot Event Loop...")
    
    # Instantiate the PTB Application with init and shutdown callbacks
    application = (
        ApplicationBuilder()
        .token(config.BOT_TOKEN)
        .post_init(post_init)
        .post_shutdown(post_shutdown)
        .build()
    )
    
    # ----------------------------------------------------
    # Register Conversation Handlers
    # ----------------------------------------------------
    
    # A. Add URL Conversation
    add_url_conv = ConversationHandler(
        entry_points=[
            CommandHandler("addurl", handlers.addurl_start),
            CallbackQueryHandler(handlers.addurl_start, pattern=r"^menu:add$")
        ],
        states={
            handlers.ADD_URL_STATE: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, handlers.addurl_receive)
            ]
        },
        fallbacks=[
            CommandHandler("cancel", handlers.cancel_conv_handler),
            CallbackQueryHandler(handlers.cancel_conv_handler, pattern=r"^conv:cancel$")
        ],
        name="add_url_conversation",
        persistent=False
    )
    
    # B. Search URL Conversation
    search_url_conv = ConversationHandler(
        entry_points=[
            CallbackQueryHandler(handlers.search_start, pattern=r"^menu:search$")
        ],
        states={
            handlers.SEARCH_URL_STATE: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, handlers.search_receive)
            ]
        },
        fallbacks=[
            CommandHandler("cancel", handlers.cancel_conv_handler),
            CallbackQueryHandler(handlers.cancel_conv_handler, pattern=r"^conv:cancel$")
        ],
        name="search_url_conversation",
        persistent=False
    )
    
    # C. Import JSON Settings Conversation
    import_json_conv = ConversationHandler(
        entry_points=[
            CallbackQueryHandler(handlers.import_settings_start, pattern=r"^settings:import$")
        ],
        states={
            handlers.IMPORT_JSON_STATE: [
                MessageHandler(filters.Document.ALL, handlers.import_settings_receive)
            ]
        },
        fallbacks=[
            CommandHandler("cancel", handlers.cancel_conv_handler),
            CallbackQueryHandler(handlers.cancel_conv_handler, pattern=r"^conv:cancel$")
        ],
        name="import_json_conversation",
        persistent=False
    )
    
    application.add_handler(add_url_conv)
    application.add_handler(search_url_conv)
    application.add_handler(import_json_conv)
    
    # ----------------------------------------------------
    # Register Core Command Handlers
    # ----------------------------------------------------
    application.add_handler(CommandHandler("start", handlers.start_command))
    application.add_handler(CommandHandler("help", handlers.help_command))
    application.add_handler(CommandHandler("list", handlers.list_urls_handler))
    application.add_handler(CommandHandler("remove", handlers.remove_url_command))
    application.add_handler(CommandHandler("status", handlers.status_command))
    application.add_handler(CommandHandler("settings", handlers.settings_menu_handler))
    
    application.add_handler(CommandHandler("startmonitor", cmd_start_monitor))
    application.add_handler(CommandHandler("stopmonitor", cmd_stop_monitor))
    
    # Regex command for url details: e.g. /detail_5
    application.add_handler(MessageHandler(
        filters.Regex(r"^/detail_\d+$"), handlers.url_detail_command
    ))
    
    # ----------------------------------------------------
    # Register Callback Query Handlers (Buttons)
    # ----------------------------------------------------
    
    # Simple navigation routing
    application.add_handler(CallbackQueryHandler(handlers.start_command, pattern=r"^menu:main$"))
    application.add_handler(CallbackQueryHandler(handlers.help_command, pattern=r"^menu:help$"))
    application.add_handler(CallbackQueryHandler(handlers.list_urls_handler, pattern=r"^menu:list:\d+(:.*)?$"))
    application.add_handler(CallbackQueryHandler(handlers.remove_url_command, pattern=r"^menu:remove_select:\d+$"))
    application.add_handler(CallbackQueryHandler(handlers.status_command, pattern=r"^menu:status$"))
    application.add_handler(CallbackQueryHandler(handlers.settings_menu_handler, pattern=r"^menu:settings$"))
    
    # Monitoring controls
    application.add_handler(CallbackQueryHandler(handlers.toggle_global_monitoring, pattern=r"^menu:(start|stop)_monitor$"))
    
    # URL configurations
    application.add_handler(CallbackQueryHandler(handlers.url_detail_callback, pattern=r"^url:detail:\d+(:\d+)?(:.*)?$"))
    application.add_handler(CallbackQueryHandler(handlers.toggle_url_callback, pattern=r"^url:toggle:\d+(:\d+)?(:.*)?$"))
    application.add_handler(CallbackQueryHandler(handlers.ping_now_callback, pattern=r"^url:ping:\d+(:\d+)?(:.*)?$"))
    application.add_handler(CallbackQueryHandler(handlers.edit_url_interval_callback, pattern=r"^url:edit_int:\d+(:\d+)?(:.*)?$"))
    application.add_handler(CallbackQueryHandler(handlers.set_url_interval_callback, pattern=r"^url:set_int:\d+:\d+(:\d+)?(:.*)?$"))
    application.add_handler(CallbackQueryHandler(handlers.delete_url_callback, pattern=r"^url:delete:\d+(:\d+)?(:.*)?$"))
    application.add_handler(CallbackQueryHandler(handlers.quick_delete_callback, pattern=r"^url:quick_delete:\d+:\d+$"))
    
    # Global exports
    application.add_handler(CallbackQueryHandler(handlers.export_settings_callback, pattern=r"^settings:export$"))
    
    # Callback query placeholder (noop buttons)
    application.add_handler(CallbackQueryHandler(lambda u, c: u.callback_query.answer(), pattern=r"^noop$"))
    
    # Register global error handler
    application.add_error_handler(global_error_handler)
    
    # Start long polling
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == "__main__":
    main()
