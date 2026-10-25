/**
 * PHANTOM V2 Chat Controller
 */
document.addEventListener('DOMContentLoaded', () => {
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');
  const voiceBtn = document.getElementById('voiceBtn');
  const ttsBtn = document.getElementById('ttsBtn');

  // Submit message handler
  window.submitChatMessage = async function () {
    if (!chatInput) return;
    const text = chatInput.value.trim();
    if (!text) return;

    audioSynth.playClickSound();
    appendMessage('user', text);
    chatInput.value = '';

    // Show temporary typing indicator
    const typingId = appendTypingIndicator();

    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      const data = await res.json();
      removeTypingIndicator(typingId);

      if (data.response) {
        appendMessage('assistant', data.response);
        // Play TTS speech
        voiceAssistant.speak(data.response);
        
        if (data.extractedMemory) {
          audioSynth.playChimeSound();
        }

        // Refresh dashboard data
        if (window.loadDashboardData) {
          window.loadDashboardData();
        }
      }
    } catch (err) {
      removeTypingIndicator(typingId);
      appendMessage('assistant', '⚠️ Connection warning. Verify PHANTOM backend is active on Port 5000.');
    }
  };

  if (sendBtn) {
    sendBtn.addEventListener('click', window.submitChatMessage);
  }

  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') window.submitChatMessage();
    });
  }

  if (voiceBtn) {
    voiceBtn.addEventListener('click', () => {
      voiceAssistant.toggleListening();
    });
  }

  if (ttsBtn) {
    ttsBtn.addEventListener('click', () => {
      const enabled = voiceAssistant.toggleSpeechOutput();
      ttsBtn.classList.toggle('active', enabled);
      ttsBtn.innerHTML = enabled ? '🔊 Voice Output: ON' : '🔇 Voice Output: OFF';
      audioSynth.playClickSound();
    });
  }

  // Quick Chips Click Delegation
  document.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('chat-chip')) {
      const promptText = e.target.getAttribute('data-prompt');
      if (promptText && chatInput) {
        chatInput.value = promptText;
        window.submitChatMessage();
      }
    }
  });
});

function appendMessage(role, content) {
  const container = document.getElementById('chatMessages');
  if (!container) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = `msg-bubble ${role}`;

  const icon = role === 'user' ? '👤' : '👻';
  msgDiv.innerHTML = `
    <div style="font-size: 11px; color: var(--primary-cyan); margin-bottom: 4px; font-weight: 600;">
      ${icon} ${role === 'user' ? 'COMMANDER' : 'PHANTOM AI Core'}
    </div>
    <div>${formatMarkdownText(content)}</div>
  `;

  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

function appendTypingIndicator() {
  const container = document.getElementById('chatMessages');
  if (!container) return null;

  const id = 'typing_' + Date.now();
  const div = document.createElement('div');
  div.id = id;
  div.className = 'msg-bubble assistant';
  div.innerHTML = `<span style="color: var(--primary-cyan);">⚡ PHANTOM processing intent...</span>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return id;
}

function removeTypingIndicator(id) {
  if (!id) return;
  const el = document.getElementById(id);
  if (el) el.remove();
}

function formatMarkdownText(text) {
  if (!text) return '';
  let formatted = text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code style="background:rgba(0,243,255,0.1); padding:2px 6px; border-radius:4px; font-family:var(--font-mono); color:var(--primary-cyan);">$1</code>')
    .replace(/\n/g, '<br>');
  return formatted;
}
