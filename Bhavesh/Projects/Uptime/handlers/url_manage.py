import html
import math
import logging
import config
from datetime import datetime, timezone
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, LinkPreviewOptions
from telegram.ext import (
    ContextTypes, 
    ConversationHandler, 
    CommandHandler, 
    MessageHandler, 
    CallbackQueryHandler, 
    filters
)

import database
import scheduler
import keyboards
import utils
from handlers.admin import admin_only

logger = logging.getLogger(__name__)

# Conversation states
ADD_URL_STATE, SEARCH_URL_STATE, IMPORT_JSON_STATE = range(3)

# ----------------------------------------------------
# 1. URL Detail view
# ----------------------------------------------------

async def get_url_detail_text(url_data: dict) -> str:
    """Helper to format the detail text block of a URL."""
    status_str = utils.format_status_code(url_data["last_status"])
    time_str = utils.format_time_ago(url_data["last_ping"])
    enabled_str = "🟢 Active" if url_data["enabled"] else "🔴 Disabled"
    
    interval_min = url_data["interval"] / 60
    interval_str = f"{url_data['interval']}s" if url_data["interval"] < 60 else f"{interval_min:.1f}m"
    
    resp_time = f"{url_data['response_time']:.1f} ms" if url_data["response_time"] else "N/A"
    
    created_at_str = "N/A"
    if url_data["created_at"]:
        try:
            # Handle standard SQLite timestamp format
            dt_str = url_data["created_at"]
            if " " in dt_str and "T" not in dt_str:
                dt_str = dt_str.replace(" ", "T")
            # If time zone is absent, treat it as UTC
            if "+" not in dt_str and dt_str[-1].upper() != 'Z':
                dt_str += "Z"
            created_at_dt = datetime.fromisoformat(dt_str)
            created_at_str = created_at_dt.strftime("%Y-%m-%d %H:%M:%S UTC")
        except Exception:
            created_at_str = str(url_data["created_at"])
    
    text = (
        f"🌐 <b>URL Health Check Details</b>\n\n"
        f"🔗 <b>URL:</b> {html.escape(url_data['url'])}\n"
        f"⚙ <b>Status:</b> {enabled_str}\n"
        f"⏱ <b>Check Interval:</b> {interval_str}\n"
        f"📊 <b>Last Status:</b> {status_str}\n"
        f"⚡ <b>Response Time:</b> {resp_time}\n"
        f"🔔 <b>Last Checked:</b> {time_str}\n"
        f"📅 <b>Added On:</b> {created_at_str}"
    )
    return text

@admin_only
async def url_detail_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handles parsing of '/detail_123' pattern."""
    message = update.message
    if not message or not message.text:
        return
        
    try:
        url_id = int(message.text.split("_")[1])
        url_data = await database.get_url(url_id)
        
        if not url_data:
            await message.reply_text("❌ Website URL not found in database.")
            return
            
        text = await get_url_detail_text(url_data)
        await message.reply_text(
            text=text,
            reply_markup=keyboards.url_detail_keyboard(url_id, url_data["enabled"]),
            parse_mode="HTML",
            link_preview_options=LinkPreviewOptions(is_disabled=True)
        )
    except Exception as e:
        logger.error(f"Error parsing detail command: {e}")
        await message.reply_text("❌ Invalid command format.")

@admin_only
async def url_detail_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handles inline detailed view of a URL."""
    query = update.callback_query
    if not query or not query.data:
        return
        
    parts = query.data.split(":")
    url_id = int(parts[2])
    page = int(parts[3]) if len(parts) > 3 else 0
    search_q = ":".join(parts[4:]) if len(parts) > 4 else ""
    
    await query.answer()
    url_data = await database.get_url(url_id)
    if not url_data:
        await query.edit_message_text("❌ Website URL not found.")
        return
        
    text = await get_url_detail_text(url_data)
    await query.edit_message_text(
        text=text,
        reply_markup=keyboards.url_detail_keyboard(url_id, url_data["enabled"], page, search_q),
        parse_mode="HTML",
        link_preview_options=LinkPreviewOptions(is_disabled=True)
    )

# ----------------------------------------------------
# 2. Add URL Conversation
# ----------------------------------------------------

@admin_only
async def addurl_start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Initiate the Add URL conversation flow."""
    prompt_text = (
        "➕ *Add Website URL*\n\n"
        "Please send me the website link you want to monitor.\n"
        "• It *must* begin with `http://` or `https://`\n"
        "• Example: `https://example.com`\n\n"
        "Send `/cancel` at any time to abort."
    )
    
    cancel_keyboard = InlineKeyboardMarkup([
        [InlineKeyboardButton("❌ Cancel", callback_data="conv:cancel")]
    ])
    
    if update.message:
        await update.message.reply_text(
            text=prompt_text,
            reply_markup=cancel_keyboard,
            parse_mode="Markdown"
        )
    elif update.callback_query:
        await update.callback_query.answer()
        await update.callback_query.edit_message_text(
            text=prompt_text,
            reply_markup=cancel_keyboard,
            parse_mode="Markdown"
        )
        
    return ADD_URL_STATE

async def addurl_receive(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Process URL sent by user."""
    url = update.message.text.strip() if update.message and update.message.text else ""
    
    if not utils.validate_url(url):
        cancel_keyboard = InlineKeyboardMarkup([
            [InlineKeyboardButton("❌ Cancel", callback_data="conv:cancel")]
        ])
        await update.message.reply_text(
            text="❌ *Invalid URL format.*\n\nPlease double check that it starts with `http://` or `https://` and features a valid domain name.\n\nTry again or send `/cancel`:",
            reply_markup=cancel_keyboard,
            parse_mode="Markdown"
        )
        return ADD_URL_STATE
        
    # Normalize URL to prevent duplicates (e.g. trailing slashes)
    normalized = utils.normalize_url(url)
    
    existing = await database.get_url_by_url(normalized)
    if existing:
        await update.message.reply_text(
            text=f"⚠️ <b>Already exists!</b>\nThe URL <code>{html.escape(normalized)}</code> is already in the database.",
            reply_markup=keyboards.back_to_menu_keyboard(),
            parse_mode="HTML"
        )
        return ConversationHandler.END
        
    try:
        url_id = await database.add_url(normalized, interval=config.DEFAULT_INTERVAL)
        logger.info(f"Added URL: {normalized} (ID: {url_id})")
        
        # If global scheduler is active, immediately schedule it
        monitoring_active = await database.get_setting("monitoring_active", "true")
        if monitoring_active == "true":
            scheduler.schedule_url(context.application, url_id, normalized, config.DEFAULT_INTERVAL)
            
        await update.message.reply_text(
            text=f"✅ <b>Success!</b>\nWebsite <code>{html.escape(normalized)}</code> added successfully.\nInterval: <b>30 seconds</b> (default).",
            reply_markup=keyboards.back_to_menu_keyboard(),
            parse_mode="HTML"
        )
    except Exception as e:
        logger.error(f"Error adding URL: {e}")
        await update.message.reply_text("❌ An unexpected database error occurred. Try again later.")
        
    return ConversationHandler.END

# ----------------------------------------------------
# 3. List URLs (with search and pagination)
# ----------------------------------------------------

@admin_only
async def list_urls_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Display paginated list of URLs with inline buttons to manage them."""
    page = 0
    query = ""
    
    if update.callback_query:
        # Format: menu:list:page:query
        parts = update.callback_query.data.split(":")
        page = int(parts[2])
        if len(parts) > 3:
            query = ":".join(parts[3:])
        await update.callback_query.answer()
    elif context.args:
        # e.g. /list example.com
        query = " ".join(context.args)
        
    limit = 5
    offset = page * limit
    
    urls = await database.search_urls(query, limit, offset)
    total_count = await database.get_urls_count(query)
    total_pages = math.ceil(total_count / limit)
    
    if not urls:
        msg_text = "📋 <b>No monitored websites found.</b>"
        if query:
            msg_text = f"📋 <b>No matching websites found for:</b> <code>{html.escape(query)}</code>"
            
        no_keyboard = InlineKeyboardMarkup([
            [InlineKeyboardButton("➕ Add URL", callback_data="menu:add")],
            [InlineKeyboardButton("◀ Back to Menu", callback_data="menu:main")]
        ])
        
        if update.callback_query:
            await update.callback_query.edit_message_text(text=msg_text, reply_markup=no_keyboard, parse_mode="HTML")
        else:
            await update.message.reply_text(text=msg_text, reply_markup=no_keyboard, parse_mode="HTML")
        return
        
    text_lines = ["📋 <b>Monitored Websites:</b>\n"]
    if query:
        text_lines.append(f"🔍 Search matches for: <code>{html.escape(query)}</code>\n")
        
    keyboard_buttons = []
    
    for index, item in enumerate(urls, start=offset + 1):
        status_str = utils.format_status_code(item["last_status"])
        time_str = utils.format_time_ago(item["last_ping"])
        interval_min = item["interval"] / 60
        interval_str = f"{item['interval']}s" if item["interval"] < 60 else f"{interval_min:.1f}m"
        
        text_lines.append(
            f"<b>{index}. {html.escape(item['url'])}</b>\n"
            f"• Status: {status_str}\n"
            f"• Checked: {time_str} | Interval: {interval_str}\n"
            f"• Details & Edit: /detail_{item['id']}\n"
        )
        
        # Build individual control row for this item
        keyboard_buttons.append([
            InlineKeyboardButton(f"⚙ Edit #{index}", callback_data=f"url:edit_int:{item['id']}:{page}:{query}"),
            InlineKeyboardButton(f"🗑 Delete #{index}", callback_data=f"url:delete:{item['id']}:{page}:{query}")
        ])
        
    # Navigation controls row
    nav_row = []
    if page > 0:
        nav_row.append(InlineKeyboardButton("◀ Prev", callback_data=f"menu:list:{page - 1}:{query}"))
    else:
        nav_row.append(InlineKeyboardButton(" ▪ ", callback_data="noop"))
        
    nav_row.append(InlineKeyboardButton(f"{page + 1}/{max(1, total_pages)}", callback_data="noop"))
    
    if page < total_pages - 1:
        nav_row.append(InlineKeyboardButton("Next ▶", callback_data=f"menu:list:{page + 1}:{query}"))
    else:
        nav_row.append(InlineKeyboardButton(" ▪ ", callback_data="noop"))
        
    keyboard_buttons.append(nav_row)
    
    # Bottom actions row
    keyboard_buttons.append([
        InlineKeyboardButton("🔍 Search", callback_data="menu:search"),
        InlineKeyboardButton("◀ Back to Menu", callback_data="menu:main")
    ])
    
    text = "\n".join(text_lines)
    
    if update.callback_query:
        await update.callback_query.edit_message_text(
            text=text, 
            reply_markup=InlineKeyboardMarkup(keyboard_buttons), 
            parse_mode="HTML",
            link_preview_options=LinkPreviewOptions(is_disabled=True)
        )
    else:
        await update.message.reply_text(
            text=text, 
            reply_markup=InlineKeyboardMarkup(keyboard_buttons), 
            parse_mode="HTML",
            link_preview_options=LinkPreviewOptions(is_disabled=True)
        )

# ----------------------------------------------------
# 4. Search URL Conversation
# ----------------------------------------------------

@admin_only
async def search_start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Prompt user to write search query."""
    prompt_text = "🔍 *Search Website URLs*\n\nPlease write a keyword or domain name to search:"
    cancel_keyboard = InlineKeyboardMarkup([
        [InlineKeyboardButton("❌ Cancel", callback_data="conv:cancel")]
    ])
    
    if update.callback_query:
        await update.callback_query.answer()
        await update.callback_query.edit_message_text(text=prompt_text, reply_markup=cancel_keyboard, parse_mode="Markdown")
    else:
        await update.message.reply_text(text=prompt_text, reply_markup=cancel_keyboard, parse_mode="Markdown")
        
    return SEARCH_URL_STATE

async def search_receive(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Process query text, trigger list with search parameters."""
    query = update.message.text.strip() if update.message and update.message.text else ""
    context.args = [query]
    await list_urls_handler(update, context)
    return ConversationHandler.END

# ----------------------------------------------------
# 5. Remove URL and Quick Delete Layout
# ----------------------------------------------------

@admin_only
async def remove_url_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handles `/remove` command."""
    page = 0
    if update.callback_query:
        parts = update.callback_query.data.split(":")
        page = int(parts[2])
        await update.callback_query.answer()
        
    limit = 6
    offset = page * limit
    
    urls = await database.search_urls(None, limit, offset)
    total_count = await database.get_urls_count(None)
    total_pages = math.ceil(total_count / limit)
    
    if not urls:
        text = "🗑 *No URLs available to delete.*"
        keyboard = keyboards.back_to_menu_keyboard()
        if update.callback_query:
            await update.callback_query.edit_message_text(text=text, reply_markup=keyboard, parse_mode="Markdown")
        else:
            await update.message.reply_text(text=text, reply_markup=keyboard, parse_mode="Markdown")
        return
        
    text = (
        "🗑 *Quick Remove Websites*\n\n"
        "Click on any button below to instantly remove the website from the monitoring database."
    )
    
    reply_markup = keyboards.remove_selection_keyboard(urls, page, total_pages)
    
    if update.callback_query:
        await update.callback_query.edit_message_text(text=text, reply_markup=reply_markup, parse_mode="Markdown")
    else:
        await update.message.reply_text(text=text, reply_markup=reply_markup, parse_mode="Markdown")

@admin_only
async def quick_delete_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handles immediate deletion callback clicks."""
    query = update.callback_query
    if not query or not query.data:
        return
        
    parts = query.data.split(":")
    url_id = int(parts[2])
    page = int(parts[3])
    
    url_data = await database.get_url(url_id)
    if url_data:
        # Unschedule job
        scheduler.unschedule_url(context.application, url_id)
        # Delete from DB
        await database.delete_url(url_id)
        logger.info(f"Deleted URL: {url_data['url']} (ID: {url_id})")
        await query.answer(f"🗑 Deleted: {url_data['url']}", show_alert=True)
    else:
        await query.answer("❌ Website URL not found.")
        
    # Re-render remove menu
    context.args = []
    update.callback_query.data = f"menu:remove_select:{page}"
    await remove_url_command(update, context)

@admin_only
async def delete_url_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handles single URL deletion from detail views with list redirection."""
    query = update.callback_query
    if not query or not query.data:
        return
        
    parts = query.data.split(":")
    url_id = int(parts[2])
    page = int(parts[3]) if len(parts) > 3 else 0
    search_q = ":".join(parts[4:]) if len(parts) > 4 else ""
    
    url_data = await database.get_url(url_id)
    if url_data:
        scheduler.unschedule_url(context.application, url_id)
        await database.delete_url(url_id)
        logger.info(f"Deleted URL: {url_data['url']} (ID: {url_id})")
        await query.answer("🗑 URL removed successfully.", show_alert=True)
    else:
        await query.answer("❌ Website URL not found.")
        
    # Redirect back to the URL list page
    query.data = f"menu:list:{page}:{search_q}"
    await list_urls_handler(update, context)

# ----------------------------------------------------
# 6. Status and Statistics Menu
# ----------------------------------------------------

@admin_only
async def status_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """View real-time status summary of all URLs and system metrics."""
    if update.callback_query:
        await update.callback_query.answer()
        
    urls = await database.get_all_urls()
    total_count = len(urls)
    
    if total_count == 0:
        empty_text = "📊 <b>Monitoring Status</b>\n\nNo URLs configured yet. Use /addurl or click Add URL below."
        keyboard = InlineKeyboardMarkup([
            [InlineKeyboardButton("➕ Add URL", callback_data="menu:add")],
            [InlineKeyboardButton("◀ Back to Menu", callback_data="menu:main")]
        ])
        if update.callback_query:
            await update.callback_query.edit_message_text(text=empty_text, reply_markup=keyboard, parse_mode="HTML")
        else:
            await update.message.reply_text(text=empty_text, reply_markup=keyboard, parse_mode="HTML")
        return
        
    online_count = 0
    offline_count = 0
    sum_response_time = 0.0
    count_response_time = 0
    
    lines = []
    
    for item in urls:
        status_val = item["last_status"]
        is_up = utils.is_status_up(status_val)
        
        if status_val is not None:
            if is_up:
                online_count += 1
                if item["response_time"]:
                    sum_response_time += item["response_time"]
                    count_response_time += 1
            else:
                offline_count += 1
                
        status_label = utils.format_status_code(status_val)
        time_lbl = utils.format_time_ago(item["last_ping"])
        
        emoji = "✅" if is_up and status_val is not None else ("❓" if status_val is None else "❌")
        
        if status_val is None:
            lines.append(f"{emoji} <b>{html.escape(item['url'])}</b>\n• Status: {status_label}\n")
        elif is_up:
            resp_time_str = f"{item['response_time']:.0f} ms" if item["response_time"] else "N/A"
            lines.append(
                f"{emoji} <b>{html.escape(item['url'])}</b>\n"
                f"• Status: {status_label}\n"
                f"• Response: {resp_time_str}\n"
                f"• Checked: {time_lbl}\n"
            )
        else:
            lines.append(
                f"{emoji} <b>{html.escape(item['url'])}</b>\n"
                f"• Status: {status_label}\n"
                f"• Checked: {time_lbl}\n"
            )
            
    avg_response = sum_response_time / count_response_time if count_response_time > 0 else 0.0
    active_str = await database.get_setting("monitoring_active", "true")
    scheduler_status = "🟢 Active" if active_str == "true" else "🔴 Paused"
    
    header = (
        f"📊 <b>Health Check Dashboard</b>\n\n"
        f"• <b>Total Websites:</b> {total_count}\n"
        f"• <b>Online:</b> {online_count} 🟢\n"
        f"• <b>Offline:</b> {offline_count} 🔴\n"
        f"• <b>Avg Response:</b> {avg_response:.0f} ms ⚡\n"
        f"• <b>Scheduler:</b> {scheduler_status}\n\n"
        f"---"
    )
    
    body = "\n".join(lines)
    full_text = f"{header}\n\n{body}"
    if len(full_text) > 4000:
        full_text = f"{header}\n\n<b>Note:</b> URL details truncated due to message length. Please list URLs using <code>/list</code>."
        
    keyboard = keyboards.back_to_menu_keyboard()
    
    if update.callback_query:
        await update.callback_query.edit_message_text(
            text=full_text,
            reply_markup=keyboard,
            parse_mode="HTML",
            link_preview_options=LinkPreviewOptions(is_disabled=True)
        )
    else:
        await update.message.reply_text(
            text=full_text,
            reply_markup=keyboard,
            parse_mode="HTML",
            link_preview_options=LinkPreviewOptions(is_disabled=True)
        )

# ----------------------------------------------------
# 7. Ping Now Action Handler
# ----------------------------------------------------

@admin_only
async def ping_now_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Manually test a single URL availability instantly."""
    query = update.callback_query
    if not query or not query.data:
        return
        
    parts = query.data.split(":")
    url_id = int(parts[2])
    page = int(parts[3]) if len(parts) > 3 else 0
    search_q = ":".join(parts[4:]) if len(parts) > 4 else ""
    
    url_data = await database.get_url(url_id)
    if not url_data:
        await query.answer("❌ Website URL not found.")
        return
        
    await query.answer("🔄 Pinging URL, please wait...")
    
    # Perform manual ping (updates DB)
    await scheduler.ping_url_once(url_id, url_data["url"])
    
    # Re-fetch new details
    new_data = await database.get_url(url_id)
    text = await get_url_detail_text(new_data)
    
    await query.edit_message_text(
        text=text,
        reply_markup=keyboards.url_detail_keyboard(url_id, new_data["enabled"], page, search_q),
        parse_mode="HTML",
        link_preview_options=LinkPreviewOptions(is_disabled=True)
    )

# ----------------------------------------------------
# 8. Single URL toggle Enabled/Disabled
# ----------------------------------------------------

@admin_only
async def toggle_url_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Toggle a URL between enabled and disabled states."""
    query = update.callback_query
    if not query or not query.data:
        return
        
    parts = query.data.split(":")
    url_id = int(parts[2])
    page = int(parts[3]) if len(parts) > 3 else 0
    search_q = ":".join(parts[4:]) if len(parts) > 4 else ""
    
    url_data = await database.get_url(url_id)
    if not url_data:
        await query.answer("❌ Website URL not found.")
        return
        
    new_state = not bool(url_data["enabled"])
    await database.update_url_enabled(url_id, new_state)
    
    # Update active schedules
    monitoring_active = await database.get_setting("monitoring_active", "true")
    if monitoring_active == "true":
        if new_state:
            scheduler.schedule_url(context.application, url_id, url_data["url"], url_data["interval"])
        else:
            scheduler.unschedule_url(context.application, url_id)
            
    status_msg = "Enabled and Scheduled" if new_state else "Disabled and Unscheduled"
    await query.answer(f"Status changed: {status_msg}")
    
    # Refresh screen
    new_data = await database.get_url(url_id)
    text = await get_url_detail_text(new_data)
    await query.edit_message_text(
        text=text,
        reply_markup=keyboards.url_detail_keyboard(url_id, new_data["enabled"], page, search_q),
        parse_mode="HTML",
        link_preview_options=LinkPreviewOptions(is_disabled=True)
    )

# ----------------------------------------------------
# 9. Cancel Conversational states
# ----------------------------------------------------

async def cancel_conv_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Abort current conversation flow and return to welcome menu."""
    from handlers.base import start_command
    
    # Clean up context args
    context.args = []
    
    # If it was a text message (e.g. /cancel), let's send an alert that it was cancelled
    if update.message:
        await update.message.reply_text("Action cancelled.")
        
    await start_command(update, context)
    return ConversationHandler.END
