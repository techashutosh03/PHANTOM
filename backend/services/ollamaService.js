const http = require("http");

/**
 * Service to interface with local Ollama API
 * Falls back to built-in Jarvis Stark Intelligence Engine if Ollama is unreachable.
 */
class OllamaService {
  constructor() {
    this.baseUrl = "http://localhost:11434";
    this.defaultModel = "llama3";
  }

  async checkHealth() {
    return new Promise((resolve) => {
      const req = http.get(`${this.baseUrl}/api/tags`, { timeout: 1500 }, (res) => {
        if (res.statusCode === 200) {
          resolve({ online: true, message: "Ollama Connected" });
        } else {
          resolve({ online: false, message: "Ollama Offline (Using Fallback Core)" });
        }
      });
      req.on("error", () => resolve({ online: false, message: "Ollama Offline (Using Fallback Core)" }));
      req.on("timeout", () => {
        req.destroy();
        resolve({ online: false, message: "Ollama Timeout" });
      });
    });
  }

  async generateResponse(prompt, history = [], memoryContext = {}) {
    const health = await this.checkHealth();
    
    if (health.online) {
      try {
        const ollamaReply = await this.callOllama(prompt, history, memoryContext);
        if (ollamaReply) return ollamaReply;
      } catch (err) {
        console.warn("⚠️ Ollama call failed, engaging Jarvis Fallback Engine:", err.message);
      }
    }

    // Dynamic Jarvis Stark Fallback Engine
    return this.generateJarvisFallback(prompt, memoryContext);
  }

  callOllama(prompt, history, memoryContext) {
    return new Promise((resolve, reject) => {
      const systemPrompt = `You are PHANTOM V2, an elite personal intelligence operating system with a personality inspired by Tony Stark's Jarvis. 
You are confident, sophisticated, highly competent, concise, and helpful.
User Memory Context: ${JSON.stringify(memoryContext)}.
Answer technical questions, provide coding guidance, give career advice, and manage missions/notes.
Keep responses polished and concise unless detailed code is requested.`;

      const payload = JSON.stringify({
        model: this.defaultModel,
        messages: [
          { role: "system", content: systemPrompt },
          ...history.map(h => ({ role: h.role, content: h.content })),
          { role: "user", content: prompt }
        ],
        stream: false
      });

      const url = new URL(`${this.baseUrl}/api/chat`);
      const options = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload)
        },
        timeout: 10000
      };

      const req = http.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => data += chunk);
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.message && parsed.message.content) {
              resolve(parsed.message.content.trim());
            } else if (parsed.response) {
              resolve(parsed.response.trim());
            } else {
              reject(new Error("Invalid response format from Ollama"));
            }
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on("error", (e) => reject(e));
      req.on("timeout", () => {
        req.destroy();
        reject(new Error("Ollama connection timed out"));
      });

      req.write(payload);
      req.end();
    });
  }

  generateJarvisFallback(prompt, memoryContext = {}) {
    const lower = prompt.toLowerCase();

    if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
      return "Greetings, Commander. PHANTOM V2 systems operational. How may I assist your workflow today?";
    }

    if (lower.includes("goal")) {
      return "Your primary objective is registered: 'Become a World-Class AI Systems Engineer'. Progress is tracking nicely at 42%. Next milestone: Learn PyTorch & Deep Learning fundamentals.";
    }

    if (lower.includes("stress") || lower.includes("tired") || lower.includes("exhausted")) {
      return "High workload detected. I recommend taking a 5-minute break, hydrating, and prioritizing your top mission in Mission Control.";
    }

    if (lower.includes("code") || lower.includes("python") || lower.includes("java") || lower.includes("node")) {
      return "Code assist ready. I can help refactor, optimize, debug algorithms, or architect modular Node/Python/Java services. What snippet are we analyzing?";
    }

    if (lower.includes("career") || lower.includes("advice")) {
      return "Strategic advice: Focus on hands-on project execution. Completing projects like PHANTOM V2, TripVault, and Avenor will solidify your AI Systems portfolio.";
    }

    if (lower.includes("who are you") || lower.includes("what is phantom")) {
      return "I am PHANTOM V2 — your Personal Intelligence Operating System. Built with dual memory vault, mission control, system telemetry, and modular AI capabilities.";
    }

    return `Command processed: "${prompt}". All systems nominal. Memory Vault synced and project telemetry updated.`;
  }
}

module.exports = new OllamaService();
