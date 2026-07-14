document.addEventListener('DOMContentLoaded', function() {
    // Chat logic
    const sendBtn = document.querySelector('.typ button');
    const input = document.querySelector('.typ input');
    const chats = document.querySelector('.chats');
    const msgDiv = document.querySelector('.msg');
    let firstMessageSent = false;

    function removeWelcome() {
        if (!firstMessageSent && msgDiv) {
            msgDiv.remove();
            firstMessageSent = true;
        }
    }

    function addMessage(text, sender) {
        removeWelcome();
        const msgBubble = document.createElement('div');
        msgBubble.className = sender === 'user' ? 'user-msg' : 'bot-msg';
        msgBubble.textContent = text;
        chats.insertBefore(msgBubble, document.querySelector('.typ'));
        chats.scrollTop = chats.scrollHeight;
    }

    sendBtn.addEventListener('click', function() {
        const msgText = input.value.trim();
        if (msgText !== "") {
            addMessage(msgText, 'user');
            input.value = "";

            setTimeout(() => {
                addMessage("Bot received: " + msgText, 'bot');
            }, 700);
        }
    });

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') sendBtn.click();
    });

    document.querySelectorAll('.btn button').forEach(btn => {
        btn.addEventListener('click', function() {
            addMessage(btn.textContent, 'user');
            input.value = "";
            setTimeout(() => {
                addMessage("Bot received: " + btn.textContent, 'bot');
            }, 700);
        });
    });

    // Sidebar logic
    const menuIcon = document.getElementById('menuIcon');
    const closeIcon = document.getElementById('closeIcon');
    const optMenu = document.querySelector('.opt');

    menuIcon.addEventListener('click', function() {
        optMenu.classList.add('open');
        menuIcon.style.display = 'none';
        closeIcon.style.display = 'inline-block';
    });

    closeIcon.addEventListener('click', function() {
        optMenu.classList.remove('open');
        closeIcon.style.display = 'none';
        menuIcon.style.display = 'inline-block';
    });
});