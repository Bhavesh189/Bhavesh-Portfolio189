import logging
from telegram import Update
from telegram.ext import ContextTypes

import database
from keyboards import main_menu_keyboard, back_to_menu_keyboard
from handlers.admin import admin_only

logger = logging.getLogger(__name__)

@admin_only
async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle /start command. Displays welcome message and main menu dashboard."""
    active_str = await database.get_setting("monitoring_active", "true")
    monitoring_active = (active_str == "true")
    
    welcome_text = (
        "🌐 *Uptime Monitor Dashboard*\n\n"
        "Welcome! This bot helps you monitor website availability and latency in real-time.\n\n"
        "🔔 *Alerting:* You will receive instant telegram alerts if a site changes status "
        "(goes DOWN 🔴 or recovers UP 🟢).\n\n"
        "Please select an option below to manage your websites:"
    )
    
    # If starting via command, send new message, otherwise edit if callback
    if update.message:
        await update.message.reply_text(
            text=welcome_text,
            reply_markup=main_menu_keyboard(monitoring_active),
            parse_mode="Markdown"
        )
    elif update.callback_query:
        await update.callback_query.answer()
        await update.callback_query.edit_message_text(
            text=welcome_text,
            reply_markup=main_menu_keyboard(monitoring_active),
            parse_mode="Markdown"
        )

@admin_only
async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle /help command or help callback. Displays usage instructions."""
    help_text = (
        "ℹ️ *Help & Usage Guide*\n\n"
        "This bot checks the health of your URLs at configured intervals.\n\n"
        "*Commands Checklist:*\n"
        "• /start - Open the dashboard menu\n"
        "• /help - Open this help message\n"
        "• /addurl - Add a URL for monitoring\n"
        "• /list - List configured URLs & check details\n"
        "• /remove - Quick delete menu for URLs\n"
        "• /status - View real-time status & statistics\n"
        "• /startmonitor - Enable global monitoring scheduler\n"
        "• /stopmonitor - Disable global monitoring scheduler\n"
        "• /settings - Export or import configuration data\n\n"
        "*Ping Technical Specifications:*\n"
        "• HTTP GET request executed asynchronously.\n"
        "• Connection timeout threshold: 20 seconds.\n"
        "• DNS, SSL, network, and HTTP errors are recorded.\n"
        "• Spam-prevention is active: Alerts are only dispatched when state changes."
    )
    
    if update.message:
        await update.message.reply_text(
            text=help_text,
            reply_markup=back_to_menu_keyboard(),
            parse_mode="Markdown"
        )
    elif update.callback_query:
        await update.callback_query.answer()
        await update.callback_query.edit_message_text(
            text=help_text,
            reply_markup=back_to_menu_keyboard(),
            parse_mode="Markdown"
        )

@admin_only
async def menu_callback_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Route general menu actions."""
    query = update.callback_query
    if not query or not query.data:
        return
        
    data = query.data
    
    if data == "menu:main":
        await start_command(update, context)
    elif data == "menu:help":
        await help_command(update, context)
