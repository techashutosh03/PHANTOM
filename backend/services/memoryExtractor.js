const db = require("../database/init");

/**
 * Selective Memory Extraction Engine
 * Evaluates messages and extracts key information (Goals, Skills, Interests, Projects, Directives)
 * Skips everyday chatter like "Hello", "How are you".
 */
class MemoryExtractor {
  async evaluateAndExtract(message) {
    if (!message || typeof message !== "string") return null;

    const trimmed = message.trim();
    const lower = trimmed.toLowerCase();

    // Skip everyday casual chatter
    const casualPatterns = [
      /^hello$/i, /^hi$/i, /^hey$/i, /^good morning$/i, /^good evening$/i,
      /^how are you/i, /^what's up/i, /^thanks$/i, /^thank you$/i, /^ok$/i, /^okay$/i
    ];
    for (const pat of casualPatterns) {
      if (pat.test(lower)) {
        return null; // Skip extraction
      }
    }

    let extracted = null;

    // 1. Explicit Remember command
    if (lower.startsWith("remember this:") || lower.startsWith("remember that:") || lower.startsWith("remember:")) {
      const content = trimmed.replace(/^remember\s*(this:|that:)?\s*/i, "").trim();
      if (content) {
        extracted = { key_type: "note", content };
      }
    }
    // 2. Goal detection
    else if (lower.includes("my goal is") || lower.includes("i want to become") || lower.includes("goal:")) {
      const content = trimmed;
      extracted = { key_type: "goal", content };
    }
    // 3. Skill detection
    else if (lower.includes("i learned") || lower.includes("i know") || lower.includes("add skill:") || lower.includes("my skill")) {
      const content = trimmed;
      extracted = { key_type: "skill", content };
    }
    // 4. Project detection
    else if (lower.includes("working on project") || lower.includes("new project:") || lower.includes("building")) {
      const content = trimmed;
      extracted = { key_type: "project", content };
    }
    // 5. Interest / Career Roadmap
    else if (lower.includes("interested in") || lower.includes("my career roadmap") || lower.includes("roadmap:")) {
      const content = trimmed;
      extracted = { key_type: "interest", content };
    }

    if (extracted) {
      this.saveMemory(extracted.key_type, extracted.content);
      return extracted;
    }

    return null;
  }

  saveMemory(keyType, content) {
    db.run(
      "INSERT INTO memory (key_type, content, source) VALUES (?, ?, ?)",
      [keyType, content, "ai_extracted"],
      function (err) {
        if (err) {
          console.error("❌ Memory Extraction Save Error:", err.message);
        } else {
          console.log(`🧠 [Memory Vault] Extracted & Saved [${keyType}]: "${content}"`);
          // Log activity
          db.run("INSERT INTO activity_logs (action, details) VALUES (?, ?)", [
            "MEMORY_SAVED",
            `Extracted ${keyType}: ${content.substring(0, 50)}...`
          ]);
        }
      }
    );
  }
}

module.exports = new MemoryExtractor();
