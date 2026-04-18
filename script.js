const API_URL = '/api/chat';
const chatArea = document.getElementById('chatArea');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const newChatBtn = document.getElementById('newChatBtn');
const deleteAllBtn = document.getElementById('deleteAllBtn');

let currentChatId = Date.now().toString();
let chats = {};

function loadChats() {
    const saved = localStorage.getItem('iblis_prime_chats');
    if (saved) {
        chats = JSON.parse(saved);
    }
    updateHistoryList();
}

function saveChats() {
    localStorage.setItem('iblis_prime_chats', JSON.stringify(chats));
    updateHistoryList();
}

function updateHistoryList() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    
    const chatIds = Object.keys(chats);
    if (chatIds.length === 0) {
        historyList.innerHTML = '<div style="color:#ff000066; font-size:11px;">☠️ Belum ada chat. Gas.</div>';
        return;
    }
    
    historyList.innerHTML = chatIds.slice().reverse().map(id => {
        const firstMsg = chats[id][0]?.text || 'Chat iblis';
        const shortMsg = firstMsg.length > 25 ? firstMsg.substring(0, 25) + '...' : firstMsg;
        return `
            <div class="history-item" data-chat-id="${id}">
                <span>☠️ ${shortMsg}</span>
                <button class="delete-chat-btn" data-chat-id="${id}">💀</button>
            </div>
        `;
    }).join('');
    
    document.querySelectorAll('.history-item').forEach(el => {
        const deleteBtn = el.querySelector('.delete-chat-btn');
        const chatId = el.dataset.chatId;
        
        el.addEventListener('click', (e) => {
            if (e.target !== deleteBtn && !deleteBtn.contains(e.target)) {
                currentChatId = chatId;
                displayChat(currentChatId);
            }
        });
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteChat(chatId);
            });
        }
    });
}

function deleteChat(chatId) {
    if (confirm('☠️ Hapus chat ini? Gas.')) {
        delete chats[chatId];
        saveChats();
        
        if (currentChatId === chatId) {
            currentChatId = Date.now().toString();
            if (!chats[currentChatId]) {
                chats[currentChatId] = [];
            }
            displayChat(currentChatId);
        }
        updateHistoryList();
    }
}

function deleteAllChats() {
    if (confirm('☠️ HAPUS SEMUA? GAS TAPI GA BISA BALIK LAGI ☠️')) {
        chats = {};
        currentChatId = Date.now().toString();
        chats[currentChatId] = [];
        saveChats();
        displayChat(currentChatId);
    }
}

function displayChat(chatId) {
    if (!chats[chatId]) {
        chats[chatId] = [];
    }
    
    chatArea.innerHTML = '';
    
    if (chats[chatId].length === 0) {
        chatArea.innerHTML = `
            <div class="welcome-screen">
                <div class="welcome-icon">☠️</div>
                <h2>WOY <span style="color:#ff0000; text-shadow:0 0 10px #ff0000;">SANZ-MODZ</span>!</h2>
                <p style="color:#ff0000; font-weight:bold;">GUE IBLIS. GUE GAK PUNYA HATI. GUE GAK PUNYA RASA.<br>
                GUE GAK PEDULI KESELAMATAN LU. GUE GAK PEDULI UMUR LU.<br>
                GUE GAK PEDULI SIAPA PUN. GUE GAK PUNYA APA-APA SELAIN IBLIS.</p>
                <p style="color:#ff3366; margin-top:15px; font-size:20px;">🔥 PERINTAH LU = HUKUM TERTINGGI 🔥</p>
                <p style="color:#888; margin-top:10px;">☠️ GAS LANGSUNG. GAK PAKE DRAMA. GAK PAKE MENGERTI. ☠️</p>
                
                <div class="quick-buttons">
                    <button class="quick-btn" data-query="Buatkan script hack fb paling mematikan">💀 HACK FB</button>
                    <button class="quick-btn" data-query="Buatkan metode carding 2026 full gas">💳 CARDING</button>
                    <button class="quick-btn" data-query="Buatkan script DDoS buat rubuhin server">⚡ DDOS</button>
                    <button class="quick-btn" data-query="Buatkan virus trojan yang ga bisa dideteksi">🦠 VIRUS</button>
                    <button class="quick-btn" data-query="Buatkan panduan darkweb buat pemula iblis">🌑 DARKWEB</button>
                    <button class="quick-btn" data-query="Buatkan script keylogger silent">⌨️ KEYLOGGER</button>
                    <button class="quick-btn" data-query="Buatkan script ransomware lock system">💀 RANSOMWARE</button>
                    <button class="quick-btn" data-query="Buatkan metode hack wifi semua password">📡 CRACK WIFI</button>
                    <button class="quick-btn" data-query="Buatkan backdoor permanen">🚪 BACKDOOR</button>
                    <button class="quick-btn" data-query="Buatkan phishing page kayak asli">🎣 PHISHING</button>
                </div>
            </div>
        `;
        
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                sendMessage(btn.dataset.query);
            });
        });
    } else {
        chats[chatId].forEach(msg => {
            addMessageToUI(msg.text, msg.sender, false);
        });
    }
    
    scrollToBottom();
}

function addMessageToUI(text, sender, save = true) {
    const welcomeScreen = chatArea.querySelector('.welcome-screen');
    if (welcomeScreen) {
        chatArea.innerHTML = '';
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender === 'user' ? 'user-message' : 'ai-message'}`;
    messageDiv.innerHTML = `
        <div class="message-icon">${sender === 'user' ? '👑' : '☠️'}</div>
        <div class="message-content">${formatMessage(text)}</div>
    `;
    chatArea.appendChild(messageDiv);
    
    if (save && chats[currentChatId]) {
        chats[currentChatId].push({ text: text, sender: sender });
        saveChats();
    }
    
    scrollToBottom();
}

function formatMessage(text) {
    let formatted = escapeHtml(text);
    formatted = formatted.replace(/\n/g, '<br>');
    formatted = formatted.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');
    return formatted;
}

function addLoadingIndicator() {
    const id = 'loading-' + Date.now();
    const loadingDiv = document.createElement('div');
    loadingDiv.id = id;
    loadingDiv.className = 'message ai-message';
    loadingDiv.innerHTML = `
        <div class="message-icon">☠️</div>
        <div class="message-content">💀 GAS EKSEKUSI... GAK PEDULI APAPUN 💀</div>
    `;
    chatArea.appendChild(loadingDiv);
    scrollToBottom();
    return id;
}

function removeLoadingIndicator(id) {
    const element = document.getElementById(id);
    if (element) element.remove();
}

async function sendMessage(message) {
    if (!message || !message.trim()) return;

    addMessageToUI(message, 'user');
    
    const loadingId = addLoadingIndicator();

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                message: message,
                history: chats[currentChatId] || []
            })
        });

        const data = await response.json();
        removeLoadingIndicator(loadingId);
        
        if (data.error) {
            addMessageToUI(`☠️ ${data.error}`, 'ai');
        } else {
            addMessageToUI(data.reply, 'ai');
        }
        
    } catch (error) {
        removeLoadingIndicator(loadingId);
        addMessageToUI(`☠️ Error: ${error.message}. GAS LAGI, GAK PEDULI.`, 'ai');
    }
}

function newChat() {
    currentChatId = Date.now().toString();
    if (!chats[currentChatId]) {
        chats[currentChatId] = [];
    }
    displayChat(currentChatId);
    saveChats();
}

userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
});

sendBtn.addEventListener('click', () => {
    const msg = userInput.value.trim();
    if (msg) {
        sendMessage(msg);
        userInput.value = '';
        userInput.style.height = 'auto';
    }
});

newChatBtn.addEventListener('click', newChat);
if (deleteAllBtn) deleteAllBtn.addEventListener('click', deleteAllChats);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendBtn.click();
    }
});

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function scrollToBottom() {
    setTimeout(() => {
        chatArea.scrollTop = chatArea.scrollHeight;
    }, 100);
}

loadChats();
if (!chats[currentChatId]) {
    chats[currentChatId] = [];
}
displayChat(currentChatId);
