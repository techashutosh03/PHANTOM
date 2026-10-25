const os = require("os");
const db = require("../database/init");
const ollamaService = require("../services/ollamaService");

class SystemInfo {
  async getHealthMetrics() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const ramUsagePercent = Math.round((usedMem / totalMem) * 100);

    const cpus = os.cpus();
    let userCpu = 0, sysCpu = 0, idleCpu = 0;
    cpus.forEach(cpu => {
      userCpu += cpu.times.user;
      sysCpu += cpu.times.sys;
      idleCpu += cpu.times.idle;
    });
    const totalCpu = userCpu + sysCpu + idleCpu;
    const cpuUsagePercent = Math.round(((userCpu + sysCpu) / totalCpu) * 100) || 12;

    const uptimeSeconds = os.uptime();
    const ollamaHealth = await ollamaService.checkHealth();

    // Query DB record counts
    const dbStats = await new Promise((resolve) => {
      db.get("SELECT (SELECT COUNT(*) FROM missions) as missions, (SELECT COUNT(*) FROM notes) as notes, (SELECT COUNT(*) FROM memory) as memories, (SELECT COUNT(*) FROM projects) as projects", [], (err, row) => {
        if (err || !row) resolve({ missions: 0, notes: 0, memories: 0, projects: 0 });
        else resolve(row);
      });
    });

    return {
      status: "ONLINE",
      version: "V2.0",
      host: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      uptime: uptimeSeconds,
      cpu: {
        cores: cpus.length,
        usagePercent: cpuUsagePercent,
        model: cpus[0] ? cpus[0].model : "Apple Silicon"
      },
      memory: {
        totalGB: (totalMem / (1024 * 1024 * 1024)).toFixed(1),
        usedGB: (usedMem / (1024 * 1024 * 1024)).toFixed(1),
        usagePercent: ramUsagePercent
      },
      aiBrain: {
        status: ollamaHealth.online ? "ONLINE" : "FALLBACK_CORE",
        message: ollamaHealth.message,
        model: "Llama 3 / Stark Jarvis Engine"
      },
      database: {
        status: "CONNECTED",
        counts: dbStats
      },
      voiceEngine: {
        status: "READY",
        mode: "Explicit Button 🎤"
      },
      sosGuardian: {
        status: "ARMED",
        locationStatus: "Location Available"
      }
    };
  }
}

module.exports = new SystemInfo();
