async function loadChatComponent() {
    try {
      const response = await fetch('static/chat.html');
      const chatHtml = await response.text();
  
      document.body.insertAdjacentHTML('beforeend', chatHtml);
  
      initChatEvents();
    } catch (error) {
      console.error('Gagal memuat chat.html:', error);
    }
  }
  
  // Function untuk logika Buka/Tutup & Kirim Pesan
  function initChatEvents() {
    const chatBtn = document.getElementById('chat-widget-button');
    const chatContainer = document.getElementById('chat-widget-container');
    const closeBtn = document.getElementById('closeChatBtn');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatMessages = document.getElementById('chatMessages');
  
    function toggleChat() {
      chatContainer.classList.toggle('open');
    }
  
    chatBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);
  
    // Kirim Pesan ke Python Backend (FastAPI)
    async function sendMessage() {
      const text = userInput.value.trim();
      if (!text) return;
    
      appendBubble(text, 'outgoing');
      userInput.value = '';
    
      try {
        const res = await fetch('http://127.0.0.1:8000/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: text
          })
        });
    
        console.log("Status:", res.status);
    
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Server response:", errorText);
          throw new Error(`HTTP ${res.status}`);
        }
    
        const data = await res.json();
    
        console.log("Response:", data);
    
        appendBubble(data.reply, 'incoming');
    
      } catch (err) {
        console.error("CHAT ERROR:", err);
    
        appendBubble(
          `Error: ${err.message}`,
          'incoming'
        );
      }
    }
  
    function appendBubble(text, sender) {
      const msg = document.createElement('div');
      msg.className = `message ${sender}`;
      msg.innerHTML = `<div class="bubble">${text}</div>`;
      chatMessages.appendChild(msg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }
  
  // Jalankan otomatis saat halaman selesai di-load
  document.addEventListener('DOMContentLoaded', loadChatComponent);