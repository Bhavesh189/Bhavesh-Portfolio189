from telegram import InlineKeyboardButton, InlineKeyboardMarkup

def main_menu_keyboard(monitoring_active: bool) -> InlineKeyboardMarkup:
    """Build the main menu dashboard keyboard."""
    keyboard = [
        [
            InlineKeyboardButton("➕ Add URL", callback_data="menu:add"),
            InlineKeyboardButton("📋 List URLs", callback_data="menu:list:0")
        ],
        [
            InlineKeyboardButton("📊 Status", callback_data="menu:status"),
            InlineKeyboardButton("🗑 Remove URL", callback_data="menu:remove_select:0")
        ],
        [
            InlineKeyboardButton(
                "⏹ Stop Monitoring" if monitoring_active else "▶ Start Monitoring",
                callback_data="menu:stop_monitor" if monitoring_active else "menu:start_monitor"
            )
        ],
        [
            InlineKeyboardButton("⚙ Settings", callback_data="menu:settings"),
            InlineKeyboardButton("ℹ Help", callback_data="menu:help")
        ]
    ]
    return InlineKeyboardMarkup(keyboard)

def back_to_menu_keyboard() -> InlineKeyboardMarkup:
    """A standard 'Back to Menu' keyboard button."""
    keyboard = [[InlineKeyboardButton("◀ Back to Main Menu", callback_data="menu:main")]]
    return InlineKeyboardMarkup(keyboard)

def pagination_keyboard(
    current_page: int, 
    total_pages: int, 
    query: str = ""
) -> InlineKeyboardMarkup:
    """Build pagination controls for list viewing."""
    nav_buttons = []
    
    # Prev button
    if current_page > 0:
        nav_buttons.append(InlineKeyboardButton("◀ Prev", callback_data=f"menu:list:{current_page - 1}:{query}"))
    else:
        nav_buttons.append(InlineKeyboardButton(" ▪ ", callback_data="noop"))  # Placeholder
        
    # Page indicator
    nav_buttons.append(
        InlineKeyboardButton(f"Page {current_page + 1}/{max(1, total_pages)}", callback_data="noop")
    )
    
    # Next button
    if current_page < total_pages - 1:
        nav_buttons.append(InlineKeyboardButton("Next ▶", callback_data=f"menu:list:{current_page + 1}:{query}"))
    else:
        nav_buttons.append(InlineKeyboardButton(" ▪ ", callback_data="noop"))  # Placeholder
        
    keyboard = [
        nav_buttons,
        [
            InlineKeyboardButton("🔍 Search URLs", callback_data="menu:search"),
            InlineKeyboardButton("◀ Back to Menu", callback_data="menu:main")
        ]
    ]
    return InlineKeyboardMarkup(keyboard)

def url_detail_keyboard(
    url_id: int, 
    enabled: bool, 
    page: int = 0, 
    query: str = ""
) -> InlineKeyboardMarkup:
    """Build management keyboard for a single URL's detail view."""
    toggle_text = "⏹ Disable" if enabled else "▶ Enable"
    keyboard = [
        [
            InlineKeyboardButton(toggle_text, callback_data=f"url:toggle:{url_id}:{page}:{query}"),
            InlineKeyboardButton("🔄 Ping Now", callback_data=f"url:ping:{url_id}:{page}:{query}")
        ],
        [
            InlineKeyboardButton("⚙ Edit Interval", callback_data=f"url:edit_int:{url_id}:{page}:{query}"),
            InlineKeyboardButton("🗑 Delete", callback_data=f"url:delete:{url_id}:{page}:{query}")
        ],
        [
            InlineKeyboardButton("◀ Back to List", callback_data=f"menu:list:{page}:{query}")
        ]
    ]
    return InlineKeyboardMarkup(keyboard)

def interval_selection_keyboard(
    url_id: int, 
    page: int = 0, 
    query: str = ""
) -> InlineKeyboardMarkup:
    """Build buttons to choose monitoring interval for a URL."""
    keyboard = [
        [
            InlineKeyboardButton("30s", callback_data=f"url:set_int:{url_id}:30:{page}:{query}"),
            InlineKeyboardButton("1m", callback_data=f"url:set_int:{url_id}:60:{page}:{query}"),
            InlineKeyboardButton("5m", callback_data=f"url:set_int:{url_id}:300:{page}:{query}")
        ],
        [
            InlineKeyboardButton("10m", callback_data=f"url:set_int:{url_id}:600:{page}:{query}"),
            InlineKeyboardButton("15m", callback_data=f"url:set_int:{url_id}:900:{page}:{query}"),
            InlineKeyboardButton("30m", callback_data=f"url:set_int:{url_id}:1800:{page}:{query}")
        ],
        [
            InlineKeyboardButton("60m", callback_data=f"url:set_int:{url_id}:3600:{page}:{query}")
        ],
        [
            InlineKeyboardButton("◀ Cancel", callback_data=f"url:detail:{url_id}:{page}:{query}")
        ]
    ]
    return InlineKeyboardMarkup(keyboard)

def settings_keyboard() -> InlineKeyboardMarkup:
    """Keyboard for importing/exporting backup data and general global settings."""
    keyboard = [
        [
            InlineKeyboardButton("📤 Export URLs to JSON", callback_data="settings:export"),
            InlineKeyboardButton("📥 Import URLs from JSON", callback_data="settings:import")
        ],
        [
            InlineKeyboardButton("◀ Back to Main Menu", callback_data="menu:main")
        ]
    ]
    return InlineKeyboardMarkup(keyboard)

def remove_selection_keyboard(
    urls: list, 
    current_page: int, 
    total_pages: int
) -> InlineKeyboardMarkup:
    """Build list of URLs with quick delete buttons."""
    keyboard = []
    
    # URL list with delete icon next to them
    for item in urls:
        truncated_url = item["url"][:30] + "..." if len(item["url"]) > 33 else item["url"]
        keyboard.append([
            InlineKeyboardButton(
                f"🗑 {truncated_url}", 
                callback_data=f"url:quick_delete:{item['id']}:{current_page}"
            )
        ])
        
    # Navigation controls
    nav_buttons = []
    if current_page > 0:
        nav_buttons.append(InlineKeyboardButton("◀ Prev", callback_data=f"menu:remove_select:{current_page - 1}"))
    else:
        nav_buttons.append(InlineKeyboardButton(" ▪ ", callback_data="noop"))
        
    nav_buttons.append(InlineKeyboardButton(f"{current_page + 1}/{max(1, total_pages)}", callback_data="noop"))
    
    if current_page < total_pages - 1:
        nav_buttons.append(InlineKeyboardButton("Next ▶", callback_data=f"menu:remove_select:{current_page + 1}"))
    else:
        nav_buttons.append(InlineKeyboardButton(" ▪ ", callback_data="noop"))
        
    keyboard.append(nav_buttons)
    keyboard.append([InlineKeyboardButton("◀ Back to Menu", callback_data="menu:main")])
    
    return InlineKeyboardMarkup(keyboard)
