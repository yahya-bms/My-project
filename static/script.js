document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatContainer = document.getElementById('chat-container');
    const sendBtn = document.getElementById('send-btn');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    const newChatBtn = document.getElementById('new-chat-btn');

    // Load chat history
    loadChatHistory();

    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Auto-resize textarea
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        
        // Enable/disable send button
        if (this.value.trim() === '') {
            sendBtn.disabled = true;
        } else {
            sendBtn.disabled = false;
        }
    });

    // Handle Enter to send (Shift+Enter for new line)
    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (this.value.trim() !== '') {
                chatForm.dispatchEvent(new Event('submit'));
            }
        }
    });

    // Handle form submission
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const message = userInput.value.trim();
        if (!message) return;

        // Reset input
        userInput.value = '';
        userInput.style.height = 'auto';
        sendBtn.disabled = true;

        // Add user message to UI
        addMessage(message, 'user');
        
        // Save to local storage
        saveMessage(message, 'user');

        // Show typing indicator
        const typingId = showTypingIndicator();

        try {
            // Send to backend
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: message })
            });

            const data = await response.json();
            
            // Remove typing indicator
            document.getElementById(typingId).remove();

            // Add AI response to UI
            addMessage(data.response, 'ai');
            
            // Save to local storage
            saveMessage(data.response, 'ai');

        } catch (error) {
            console.error('Error:', error);
            document.getElementById(typingId).remove();
            addMessage("Sorry, I encountered a network error. Please try again.", 'ai');
        }
    });

    // New Chat Button
    newChatBtn.addEventListener('click', clearChat);

    function addMessage(content, sender, save = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const icon = sender === 'user' ? '<i class="fa-solid fa-user"></i>' : '<i class="fa-solid fa-robot"></i>';
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Parse markdown if it's AI
        const parsedContent = sender === 'ai' ? marked.parse(content) : `<p>${escapeHTML(content)}</p>`;

        let actionsHtml = '';
        if (sender === 'ai') {
            actionsHtml = `
                <div class="message-actions">
                    <button class="action-btn" onclick="copyText(this)" title="Copy response">
                        <i class="fa-regular fa-copy"></i>
                    </button>
                </div>
            `;
        }

        messageDiv.innerHTML = `
            <div class="message-avatar">
                ${icon}
            </div>
            <div class="message-content">
                ${parsedContent}
                ${actionsHtml}
                <span class="timestamp">${timestamp}</span>
            </div>
        `;

        chatContainer.appendChild(messageDiv);
        scrollToBottom();
    }

    function showTypingIndicator() {
        const id = 'typing-' + Date.now();
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ai';
        messageDiv.id = id;
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fa-solid fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
            </div>
        `;
        
        chatContainer.appendChild(messageDiv);
        scrollToBottom();
        return id;
    }

    function scrollToBottom() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
});

// Global functions
function saveMessage(content, sender) {
    let history = JSON.parse(localStorage.getItem('chatHistory')) || [];
    history.push({ content, sender, timestamp: new Date().toISOString() });
    localStorage.setItem('chatHistory', JSON.stringify(history));
}

function loadChatHistory() {
    const history = JSON.parse(localStorage.getItem('chatHistory')) || [];
    if (history.length > 0) {
        // Remove welcome message if there is history
        const welcomeMsg = document.getElementById('welcome-message');
        if (welcomeMsg) welcomeMsg.remove();

        history.forEach(msg => {
            addMessageFromHistory(msg.content, msg.sender, msg.timestamp);
        });
    }
}

function addMessageFromHistory(content, sender, timeString) {
    const chatContainer = document.getElementById('chat-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const icon = sender === 'user' ? '<i class="fa-solid fa-user"></i>' : '<i class="fa-solid fa-robot"></i>';
    const date = new Date(timeString);
    const timestamp = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const parsedContent = sender === 'ai' ? marked.parse(content) : `<p>${escapeHTML(content)}</p>`;

    let actionsHtml = '';
    if (sender === 'ai') {
        actionsHtml = `
            <div class="message-actions">
                <button class="action-btn" onclick="copyText(this)" title="Copy response">
                    <i class="fa-regular fa-copy"></i>
                </button>
            </div>
        `;
    }

    messageDiv.innerHTML = `
        <div class="message-avatar">
            ${icon}
        </div>
        <div class="message-content">
            ${parsedContent}
            ${actionsHtml}
            <span class="timestamp">${timestamp}</span>
        </div>
    `;

    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function clearChat() {
    if (confirm('Are you sure you want to clear your chat history?')) {
        localStorage.removeItem('chatHistory');
        location.reload();
    }
}

function copyText(btn) {
    const content = btn.parentElement.previousElementSibling; // The markdown/p element
    let textToCopy = content.innerText;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        const icon = btn.querySelector('i');
        icon.className = 'fa-solid fa-check';
        setTimeout(() => {
            icon.className = 'fa-regular fa-copy';
        }, 2000);
    });
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
