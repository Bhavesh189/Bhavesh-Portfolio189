import html
import io
import logging
from datetime import datetime
from telegram import Update
from telegram.ext import ContextTypes, ConversationHandler

import database
import scheduler
import keyboards
import utils
from handlers.admin import admin_only

logger = logging.getLogger(__name__)

# Re-use conversation state
from handlers.url_manage import IMPORT_JSON_STATE

@admin_only
async def settings_menu_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Display the backup and settings menu."""
    query = update.callback_query
    if query:
        await query.answer()
        
    text = (
        "⚙ *Settings & Configuration*\n\n"
        "Here you can backup your current uptime configuration or restore it from a backup file."
    )
    
    if query:
        await query.edit_message_text(text=text, reply_markup=keyboards.settings_keyboard(), parse_mode="Markdown")
    else:
        await update.message.reply_text(text=text, reply_markup=keyboards.settings_keyboard(), parse_mode="Markdown")

# ----------------------------------------------------
# 1. Start / Stop Global Monitoring
# ----------------------------------------------------

@admin_only
async def toggle_global_monitoring(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Toggles global background monitoring checks."""
    query = update.callback_query
    if not query or not query.data:
        return
        
    data = query.data
    await query.answer()
    
    if data == "menu:start_monitor":
        await scheduler.start_monitoring(context.application)
        await query.answer("▶ Global monitoring is now started.", show_alert=True)
    elif data == "menu:stop_monitor":
        await scheduler.stop_monitoring(context.application)
        await query.answer("⏹ Global monitoring is now stopped.", show_alert=True)
        
    # Refresh start menu
    from handlers.base import start_command
    await start_command(update, context)

# ----------------------------------------------------
# 2. Interval Config per URL
# ----------------------------------------------------

@admin_only
async def edit_url_interval_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Displays the interval choice keyboard for a URL."""
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
        
    text = (
        f"⚙ <b>Edit Monitoring Interval</b>\n\n"
        f"URL: <code>{html.escape(url_data['url'])}</code>\n\n"
        f"Choose how often you want health checks to run for this site:"
    )
    
    await query.edit_message_text(
        text=text,
        reply_markup=keyboards.interval_selection_keyboard(url_id, page, search_q),
        parse_mode="HTML"
    )

@admin_only
async def set_url_interval_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Updates the interval value in DB and running scheduler."""
    query = update.callback_query
    if not query or not query.data:
        return
        
    parts = query.data.split(":")
    url_id = int(parts[2])
    seconds = int(parts[3])
    page = int(parts[4]) if len(parts) > 4 else 0
    search_q = ":".join(parts[5:]) if len(parts) > 5 else ""
    
    url_data = await database.get_url(url_id)
    if not url_data:
        await query.answer("❌ Website URL not found.")
        return
        
    # Update DB
    await database.update_url_interval(url_id, seconds)
    
    # Reschedule if monitoring is active
    monitoring_active = await database.get_setting("monitoring_active", "true")
    if monitoring_active == "true" and url_data["enabled"]:
        scheduler.schedule_url(context.application, url_id, url_data["url"], seconds)
        
    interval_desc = f"{seconds}s" if seconds < 60 else f"{seconds // 60}m"
    await query.answer(f"Interval set to {interval_desc}")
    
    # Re-render URL detail view
    # Redirect parameters back
    query.data = f"url:detail:{url_id}:{page}:{search_q}"
    from handlers.url_manage import url_detail_callback
    await url_detail_callback(update, context)

# ----------------------------------------------------
# 3. Export Configurations to JSON File
# ----------------------------------------------------

@admin_only
async def export_settings_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Export DB configurations to a JSON file and send as a telegram document."""
    query = update.callback_query
    if query:
        await query.answer("Generating backup...")
        
    urls = await database.get_all_urls()
    if not urls:
        msg = "⚠️ *Nothing to export.* Add URLs first."
        if query:
            await query.edit_message_text(text=msg, reply_markup=keyboards.back_to_menu_keyboard(), parse_mode="Markdown")
        else:
            await update.message.reply_text(text=msg, reply_markup=keyboards.back_to_menu_keyboard(), parse_mode="Markdown")
        return
        
    try:
        json_content = utils.export_to_json(urls)
        
        # Create bytes stream for document upload
        bio = io.BytesIO(json_content.encode("utf-8"))
        bio.name = f"uptime_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        chat_id = update.effective_chat.id
        await context.bot.send_document(
            chat_id=chat_id,
            document=bio,
            caption="📤 *Configuration Backup Export*\n\nKeep this file safe! You can use it to restore your URLs on another bot deployment.",
            parse_mode="Markdown"
        )
        
        # Redirect back to settings menu
        await settings_menu_handler(update, context)
        
    except Exception as e:
        logger.error(f"Error exporting config: {e}", exc_info=True)
        if query:
            await query.answer("❌ Export failed.", show_alert=True)

# ----------------------------------------------------
# 4. Import Configurations from JSON File
# ----------------------------------------------------

@admin_only
async def import_settings_start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Prompts user to upload the JSON backup file."""
    prompt_text = (
        "📥 *Import Configurations*\n\n"
        "Please send/upload a `.json` backup file containing your configurations.\n\n"
        "File schema example:\n"
        "`[`\n"
        "  `{`\n"
        "    `\"url\": \"https://example.com\",`\n"
        "    `\"interval\": 300,`\n"
        "    `\"enabled\": true`\n"
        "  `}`\n"
        "`]`"
    )
    cancel_keyboard = keyboards.back_to_menu_keyboard()
    
    if update.callback_query:
        await update.callback_query.answer()
        await update.callback_query.edit_message_text(text=prompt_text, reply_markup=cancel_keyboard, parse_mode="Markdown")
    else:
        await update.message.reply_text(text=prompt_text, reply_markup=cancel_keyboard, parse_mode="Markdown")
        
    return IMPORT_JSON_STATE

async def import_settings_receive(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Download JSON file, parse configuration, and write to SQLite DB."""
    message = update.message
    if not message or not message.document:
        await message.reply_text("❌ Please send a valid `.json` document file.")
        return IMPORT_JSON_STATE
        
    doc = message.document
    if not doc.file_name or not doc.file_name.endswith(".json"):
        await message.reply_text("❌ Invalid format. File extension must be `.json`.")
        return IMPORT_JSON_STATE
        
    try:
        telegram_file = await context.bot.get_file(doc.file_id)
        file_bytes = await telegram_file.download_as_bytearray()
        json_str = file_bytes.decode("utf-8")
        
        parsed_urls = utils.parse_import_json(json_str)
        if not parsed_urls:
            await message.reply_text("❌ No valid URLs parsed from the JSON backup file.")
            return ConversationHandler.END
            
        import_count = 0
        skip_count = 0
        
        for item in parsed_urls:
            # Normalize URL to avoid duplicate slash formats
            normalized = utils.normalize_url(item["url"])
            existing = await database.get_url_by_url(normalized)
            if existing:
                skip_count += 1
                continue
                
            url_id = await database.add_url(normalized, item["interval"])
            await database.update_url_enabled(url_id, item["enabled"])
            
            # Immediately schedule if enabled & global scheduler is active
            active_str = await database.get_setting("monitoring_active", "true")
            if active_str == "true" and item["enabled"]:
                scheduler.schedule_url(context.application, url_id, normalized, item["interval"])
                
            import_count += 1
            
        logger.info(f"Imported backup: {import_count} added, {skip_count} skipped.")
        
        await message.reply_text(
            text=f"✅ *Import Completed!*\n\n"
                 f"• *Imported successfully:* {import_count} URLs\n"
                 f"• *Skipped (duplicates):* {skip_count} URLs",
            reply_markup=keyboards.back_to_menu_keyboard(),
            parse_mode="Markdown"
        )
        
    except ValueError as ve:
        logger.warning(f"Validation failure reading json import: {ve}")
        await message.reply_text(f"❌ *Validation Error:*\n{ve}", parse_mode="Markdown")
    except Exception as e:
        logger.error(f"Unexpected crash during config import: {e}", exc_info=True)
        await message.reply_text("❌ An unexpected system error occurred during database migration.")
        
    return ConversationHandler.END
