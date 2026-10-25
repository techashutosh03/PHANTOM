/**
 * Voice Assistant Module for PHANTOM V2
 * Uses Web Speech API (Speech Recognition + Speech Synthesis)
 * Activated via explicit Voice Button 🎤
 */
class VoiceAssistant {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.speechEnabled = true;
    this.initRecognition();
  }

  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-US';
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.updateVoiceButtonUI(true);
        audioSynth.playClickSound();
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('🎤 [Voice Recognized]:', transcript);
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
          chatInput.value = transcript;
          // Trigger Chat Submit
          if (window.submitChatMessage) {
            window.submitChatMessage();
          }
        }
      };

      this.recognition.onerror = (e) => {
        console.warn('🎤 Voice Recognition Error:', e.error);
        this.isListening = false;
        this.updateVoiceButtonUI(false);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.updateVoiceButtonUI(false);
      };
    } else {
      console.warn('🎤 Speech Recognition API not supported in this browser.');
    }
  }

  toggleListening() {
    if (!this.recognition) {
      alert('Voice recognition is not supported in your current browser. Please use Chrome or Brave.');
      return;
    }

    if (this.isListening) {
      this.recognition.stop();
    } else {
      try {
        this.recognition.start();
      } catch (err) {
        console.error('Error starting recognition:', err);
      }
    }
  }

  updateVoiceButtonUI(listening) {
    const btn = document.getElementById('voiceBtn');
    if (btn) {
      if (listening) {
        btn.classList.add('active');
        btn.innerHTML = '🔴 Listening...';
        btn.style.boxShadow = '0 0 20px var(--neon-red)';
      } else {
        btn.classList.remove('active');
        btn.innerHTML = '🎤 Speak';
        btn.style.boxShadow = 'none';
      }
    }
  }

  speak(text) {
    if (!this.speechEnabled || !('speechSynthesis' in window)) return;

    // Sanitize markdown symbols from spoken text
    const cleanText = text.replace(/[*#_`~]/g, '').substring(0, 300);

    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick best English voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => (v.name.includes('Daniel') || v.name.includes('Samantha') || v.name.includes('Google') || v.lang === 'en-US'));
    if (preferredVoice) utterance.voice = preferredVoice;

    window.speechSynthesis.speak(utterance);
  }

  toggleSpeechOutput() {
    this.speechEnabled = !this.speechEnabled;
    if (!this.speechEnabled) {
      window.speechSynthesis.cancel();
    }
    return this.speechEnabled;
  }
}

const voiceAssistant = new VoiceAssistant();
