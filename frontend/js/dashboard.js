/**
 * PHANTOM V2 Dashboard Controller & Data Telemetry
 */
window.loadDashboardData = async function () {
  await Promise.all([
    fetchUserProfile(),
    fetchMissions(),
    fetchProjects(),
    fetchNotes(),
    fetchMemoryVault(),
    fetchEmotionState(),
    fetchSystemHealth(),
    fetchActivityLogs()
  ]);
};

// 1. USER PROFILE & SKILLS ENGINE & GOAL PREDICTOR
async function fetchUserProfile() {
  try {
    const res = await fetch('/api/auth/profile');
    const profile = await res.json();

    // Goal Predictor UI
    const goalTitle = document.getElementById('goalTitle');
    const milestoneTitle = document.getElementById('milestoneTitle');
    const goalProgressFill = document.getElementById('goalProgressFill');
    const goalPercentText = document.getElementById('goalPercentText');

    if (goalTitle) goalTitle.textContent = profile.currentGoal || "Become a World-Class AI Systems Engineer";
    if (milestoneTitle) milestoneTitle.textContent = profile.nextMilestone || "Learn PyTorch & Deep Learning";
    if (goalProgressFill) goalProgressFill.style.width = (profile.progress || 42) + '%';
    if (goalPercentText) goalPercentText.textContent = (profile.progress || 42) + '% Complete';

    // Current Skills UI
    const currentSkillsList = document.getElementById('currentSkillsList');
    if (currentSkillsList && profile.skills) {
      const skillsArray = profile.skills.split(',').map(s => s.trim());
      currentSkillsList.innerHTML = skillsArray.map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`).join('');
    }

    // AI Recommended Next Skills
    const nextSkillsList = document.getElementById('nextSkillsList');
    if (nextSkillsList) {
      const recSkills = ["PyTorch", "LLM Fine-Tuning", "Ollama API", "Docker", "LangChain"];
      nextSkillsList.innerHTML = recSkills.map(s => `<span class="skill-tag recommended">+ ${s}</span>`).join('');
    }
  } catch (err) {
    console.warn('Error loading user profile:', err);
  }
}

// 2. MISSION CONTROL
async function fetchMissions() {
  try {
    const res = await fetch('/api/missions');
    const missions = await res.json();
    const container = document.getElementById('missionsContainer');
    if (!container) return;

    if (!missions || missions.length === 0) {
      container.innerHTML = `<div style="color: var(--text-dim); text-align: center; padding: 20px;">No active missions. Add one below.</div>`;
      return;
    }

    container.innerHTML = missions.map(m => `
      <div class="glass-panel" style="padding: 12px 16px; margin-bottom: 10px; background: rgba(15, 23, 42, 0.4);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="font-weight: 600; font-size: 14px; ${m.status === 'completed' ? 'text-decoration: line-through; color: var(--text-dim);' : ''}">
            🎯 ${escapeHtml(m.title)}
          </span>
          <div style="display: flex; gap: 8px; align-items: center;">
            <button onclick="toggleMissionStatus(${m.id}, '${m.status === 'completed' ? 'active' : 'completed'}')" class="glow-btn" style="padding: 4px 10px; font-size: 11px;">
              ${m.status === 'completed' ? 'Undo' : 'Complete ✓'}
            </button>
            <button onclick="deleteMission(${m.id})" style="background: none; border: none; color: var(--neon-red); cursor: pointer; font-size: 14px;">✕</button>
          </div>
        </div>
        <div class="hud-progress">
          <div class="hud-progress-fill" style="width: ${m.progress || (m.status === 'completed' ? 100 : 35)}%;"></div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.warn('Error loading missions:', err);
  }
}

window.addMission = async function () {
  const input = document.getElementById('newMissionInput');
  if (!input || !input.value.trim()) return;
  const title = input.value.trim();
  audioSynth.playClickSound();

  await fetch('/api/missions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });

  input.value = '';
  fetchMissions();
};

window.toggleMissionStatus = async function (id, status) {
  audioSynth.playChimeSound();
  await fetch(`/api/missions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, progress: status === 'completed' ? 100 : 40 })
  });
  fetchMissions();
};

window.deleteMission = async function (id) {
  audioSynth.playClickSound();
  await fetch(`/api/missions/${id}`, { method: 'DELETE' });
  fetchMissions();
};

// 3. PROJECT TRACKER
async function fetchProjects() {
  try {
    const res = await fetch('/api/projects');
    const projects = await res.json();
    const container = document.getElementById('projectsContainer');
    if (!container) return;

    if (!projects || projects.length === 0) {
      container.innerHTML = `<div style="color: var(--text-dim);">No active projects registered.</div>`;
      return;
    }

    container.innerHTML = projects.map(p => `
      <div style="padding: 12px; border-radius: var(--radius-md); background: rgba(3, 7, 18, 0.5); border: 1px solid var(--border-glass); margin-bottom: 10px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="font-weight: 700; font-size: 14px; color: var(--primary-cyan);">🚀 ${escapeHtml(p.name)}</div>
          <span class="pill-badge ${p.status === 'Completed' ? 'active' : ''}">${p.status}</span>
        </div>
        <div style="font-size: 12px; color: var(--text-muted); margin: 6px 0;">${escapeHtml(p.description)}</div>
        <div class="hud-progress" style="margin-top: 8px;">
          <div class="hud-progress-fill" style="width: ${p.progress}%;"></div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.warn('Error loading projects:', err);
  }
}

// 4. SECOND BRAIN (NOTES)
async function fetchNotes(category = 'All', search = '') {
  try {
    const res = await fetch(`/api/notes?category=${encodeURIComponent(category)}&search=${encodeURIComponent(search)}`);
    const notes = await res.json();
    const container = document.getElementById('notesContainer');
    if (!container) return;

    if (!notes || notes.length === 0) {
      container.innerHTML = `<div style="color: var(--text-dim); text-align: center; padding: 15px;">No notes found in "${category}".</div>`;
      return;
    }

    container.innerHTML = notes.map(n => `
      <div style="padding: 12px; border-radius: var(--radius-md); background: rgba(15, 23, 42, 0.4); border: 1px solid var(--border-glass); margin-bottom: 10px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <strong style="font-size: 13px; color: #fff;">📝 ${escapeHtml(n.title)}</strong>
          <span class="skill-tag" style="font-size: 10px;">${escapeHtml(n.category)}</span>
        </div>
        <div style="font-size: 12px; color: var(--text-muted); margin-top: 6px; white-space: pre-line;">${escapeHtml(n.content)}</div>
      </div>
    `).join('');
  } catch (err) {
    console.warn('Error loading notes:', err);
  }
}

window.filterNotesCategory = function (category) {
  audioSynth.playClickSound();
  document.querySelectorAll('.note-cat-pill').forEach(el => el.classList.remove('active'));
  const activePill = document.getElementById(`cat_${category}`);
  if (activePill) activePill.classList.add('active');
  fetchNotes(category);
};

window.saveNewNote = async function () {
  const titleInput = document.getElementById('noteTitleInput');
  const contentInput = document.getElementById('noteContentInput');
  const categorySelect = document.getElementById('noteCategorySelect');

  if (!titleInput || !contentInput || !titleInput.value.trim() || !contentInput.value.trim()) {
    alert('Please enter note title and content.');
    return;
  }

  audioSynth.playChimeSound();
  await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: titleInput.value.trim(),
      content: contentInput.value.trim(),
      category: categorySelect ? categorySelect.value : 'Personal'
    })
  });

  titleInput.value = '';
  contentInput.value = '';
  fetchNotes();
};

// 5. SMART MEMORY VAULT
async function fetchMemoryVault() {
  try {
    const res = await fetch('/api/memory');
    const memories = await res.json();
    const countBadge = document.getElementById('memoryCountBadge');
    if (countBadge) countBadge.textContent = `${memories.length} Items`;
  } catch (err) {
    console.warn('Error loading memory vault:', err);
  }
}

// 6. EMOTION ENGINE
async function fetchEmotionState() {
  try {
    const res = await fetch('/api/emotion');
    const data = await res.json();

    const stateEl = document.getElementById('emotionStateLabel');
    const stressBar = document.getElementById('stressBarFill');
    const stressText = document.getElementById('stressPercentText');
    const adviceEl = document.getElementById('emotionAdviceCard');

    if (stateEl) stateEl.innerHTML = `${data.emoji} ${data.state}`;
    if (stressBar) stressBar.style.width = `${data.stressPercent}%`;
    if (stressText) stressText.textContent = `${data.stressPercent}%`;
    if (adviceEl) adviceEl.textContent = data.advice;
  } catch (err) {
    console.warn('Error loading emotion state:', err);
  }
}

// 7. SYSTEM HEALTH TELEMETRY
async function fetchSystemHealth() {
  try {
    const res = await fetch('/api/health');
    const metrics = await res.json();

    const cpuVal = document.getElementById('cpuUsageVal');
    const ramVal = document.getElementById('ramUsageVal');
    const aiStatusVal = document.getElementById('aiStatusVal');
    const dbStatusVal = document.getElementById('dbStatusVal');

    if (cpuVal) cpuVal.textContent = `${metrics.cpu.usagePercent}%`;
    if (ramVal) ramVal.textContent = `${metrics.memory.usagePercent}% (${metrics.memory.usedGB} / ${metrics.memory.totalGB} GB)`;
    if (aiStatusVal) aiStatusVal.textContent = metrics.aiBrain.status === 'ONLINE' ? '🟢 Ollama Llama 3' : '🟡 Jarvis Fallback Core';
    if (dbStatusVal) dbStatusVal.textContent = '🟢 Connected (phantom.db)';
  } catch (err) {
    console.warn('Error loading system health:', err);
  }
}

// 8. ACTIVITY LOG
async function fetchActivityLogs() {
  try {
    const res = await fetch('/api/activity');
    const logs = await res.json();
    const container = document.getElementById('activityLogContainer');
    if (!container) return;

    if (!logs || logs.length === 0) {
      container.innerHTML = `<div style="color: var(--text-dim);">No recent activity.</div>`;
      return;
    }

    container.innerHTML = logs.slice(0, 10).map(l => {
      const timeStr = new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      return `
        <div style="font-size: 12px; margin-bottom: 8px; border-bottom: 1px dashed rgba(255,255,255,0.08); padding-bottom: 6px;">
          <span style="color: var(--text-dim); font-family: var(--font-mono);">${timeStr}</span>
          <span style="color: var(--primary-cyan); font-weight: 600; margin: 0 6px;">[${l.action}]</span>
          <span style="color: #cbd5e1;">${escapeHtml(l.details || '')}</span>
        </div>
      `;
    }).join('');
  } catch (err) {
    console.warn('Error loading activity log:', err);
  }
}

// 9. SOS GUARDIAN
window.triggerSOSGuardian = async function () {
  audioSynth.playAlertSound();
  const card = document.getElementById('sosCard');
  const statusEl = document.getElementById('sosBannerStatus');

  if (card) card.classList.add('sos-card-active');
  if (statusEl) {
    statusEl.innerHTML = '🚨 EMERGENCY SOS ACTIVE — Location Available — Alert Broadcast Sent!';
    statusEl.style.color = 'var(--neon-red)';
  }

  await fetch('/api/sos/trigger', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customMessage: 'SOS Triggered from PHANTOM V2 Operating System Dashboard' })
  });

  fetchActivityLogs();
};

window.resetSOSGuardian = async function () {
  audioSynth.playClickSound();
  const card = document.getElementById('sosCard');
  const statusEl = document.getElementById('sosBannerStatus');

  if (card) card.classList.remove('sos-card-active');
  if (statusEl) {
    statusEl.innerHTML = '🛡️ SOS Guardian Standby — Location Available';
    statusEl.style.color = 'var(--neon-green)';
  }

  await fetch('/api/sos/reset', { method: 'POST' });
  fetchActivityLogs();
};

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
