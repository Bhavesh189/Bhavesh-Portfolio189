import logging
from functools import wraps
from telegram import Update
from telegram.ext import ContextTypes

import config

logger = logging.getLogger(__name__)

def admin_only(func):
    """
    Decorator to restrict access to a command or callback query handler.
    Only allows execution if the user ID is in config.ADMIN_IDS.
    """
    @wraps(func)
    async def wrapper(update: Update, context: ContextTypes.DEFAULT_TYPE, *args, **kwargs):
        user = update.effective_user
        if not user:
            # If there is no user context (e.g. some system updates), do nothing
            return
            
        if user.id not in config.ADMIN_IDS:
            logger.warning(
                f"Unauthorized access blocked: User {user.id} "
                f"(@{user.username or 'no_username'}) tried to use {func.__name__}"
            )
            
            # Respond appropriately depending on type of update
            if update.message:
                await update.message.reply_text("You are not authorized.")
            elif update.callback_query:
                await update.callback_query.answer(
                    text="You are not authorized.", 
                    show_alert=True
                )
            return
            
        return await func(update, context, *args, **kwargs)
        
    return wrapper
