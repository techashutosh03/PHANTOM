const { exec } = require("child_process");
const db = require("../database/init");

/**
 * System Command Executor for PHANTOM V2
 * Safely launches desktop applications & directories on macOS.
 * Power commands (Shutdown/Restart/Sleep) are explicitly disabled in V2 for security.
 */
class CommandExecutor {
  constructor() {
    this.appMap = {
      chrome: "Google Chrome",
      vscode: "Visual Studio Code",
      code: "Visual Studio Code",
      terminal: "Terminal",
      calculator: "Calculator",
      finder: "Finder"
    };
  }

  parseAndExecute(commandText) {
    if (!commandText || typeof commandText !== "string") {
      return { executed: false, message: "Invalid command input." };
    }

    const lower = commandText.toLowerCase().trim();

    // Check for prohibited power commands
    if (lower.includes("shutdown") || lower.includes("restart") || lower.includes("sleep")) {
      return {
        executed: false,
        message: "⚠️ Power commands (Shutdown/Restart/Sleep) are deferred to V3 for safety protocol compliance."
      };
    }

    // Open Chrome
    if (lower.includes("open chrome") || lower.includes("launch chrome")) {
      return this.launchApp("Google Chrome");
    }

    // Open VS Code
    if (lower.includes("open vs code") || lower.includes("open vscode") || lower.includes("open code")) {
      return this.launchApp("Visual Studio Code");
    }

    // Open Terminal
    if (lower.includes("open terminal") || lower.includes("launch terminal")) {
      return this.launchApp("Terminal");
    }

    // Open Calculator
    if (lower.includes("open calculator") || lower.includes("launch calculator")) {
      return this.launchApp("Calculator");
    }

    // Open Finder / Open Folder
    if (lower.includes("open finder") || lower.includes("open folder") || lower.includes("open directory")) {
      return this.launchFolder("~");
    }

    return { executed: false, message: null };
  }

  launchApp(appName) {
    const cmd = `open -a "${appName}"`;
    exec(cmd, (err) => {
      if (err) {
        console.error(`❌ Failed to launch ${appName}:`, err.message);
      } else {
        console.log(`🚀 [System Command] Launched app: ${appName}`);
        db.run("INSERT INTO activity_logs (action, details) VALUES (?, ?)", [
          "APP_OPENED",
          `Launched ${appName}`
        ]);
      }
    });

    return {
      executed: true,
      message: `🚀 Launching ${appName}...`
    };
  }

  launchFolder(folderPath) {
    const cmd = `open "${folderPath}"`;
    exec(cmd, (err) => {
      if (err) {
        console.error(`❌ Failed to open folder ${folderPath}:`, err.message);
      } else {
        console.log(`📁 [System Command] Opened folder: ${folderPath}`);
        db.run("INSERT INTO activity_logs (action, details) VALUES (?, ?)", [
          "APP_OPENED",
          `Opened directory: ${folderPath}`
        ]);
      }
    });

    return {
      executed: true,
      message: `📁 Opening Finder directory...`
    };
  }
}

module.exports = new CommandExecutor();
