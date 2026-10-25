# 👻 PHANTOM V2 - Personal Intelligence Operating System

PHANTOM is a next-generation personal intelligence and productivity operating system designed with a futuristic, cyberpunk tactical interface. It integrates local AI capabilities, autonomous memory extraction, mission tracking, note-taking, emotional telemetry, voice interaction, and system command execution.

---

## 🌟 Key Features

- **Cyberpunk HUD & Dashboard**: High-immersion tactical UI with audio synthesis soundscapes, boot sequences, and live telemetry.
- **Smart Memory Vault**: Dynamic extraction and persistent storage of goals, skills, roadmap items, preferences, and key notes.
- **Mission Control**: Track high-priority objectives, milestones, and task progress.
- **Second Brain / Tactical Notes**: Categorized knowledge base with tagging and quick retrieval.
- **Local AI & Chat**: Intelligent conversational agent powered by local LLMs (Ollama) with emotion detection.
- **Voice Synthesis & Control**: Web Audio API-powered sound effects and speech recognition support.
- **System Command Execution & Health Telemetry**: System metrics and command execution endpoints.

---

## 📂 Project Architecture

```
PHANTOM/
├── backend/
│   ├── config/              # User configuration & profiles
│   ├── database/            # SQLite schema initialization & database
│   ├── routes/              # Modular Express API endpoints
│   │   ├── activity.js      # System & user activity logging
│   │   ├── ai.js            # Ollama/AI inference routing
│   │   ├── auth.js          # Authentication & token verification
│   │   ├── commands.js      # Command execution endpoints
│   │   ├── emotion.js       # Emotional telemetry analysis
│   │   ├── health.js        # System health & CPU/RAM diagnostics
│   │   ├── memory.js        # Smart memory extraction & retrieval
│   │   ├── missions.js      # Mission management
│   │   ├── notes.js         # Second brain knowledge base
│   │   ├── projects.js      # Project workspace tracking
│   │   └── sos.js           # Emergency override & distress protocols
│   ├── services/            # AI, OCR, vision, and command services
│   ├── utils/               # System helpers & utilities
│   ├── server.js            # Express server entry point
│   └── package.json         # Backend dependencies & scripts
│
└── frontend/
    ├── css/                 # Cyberpunk styling (boot, login, theme, dashboard)
    ├── js/                  # Client logic (audioSynth, chat, dashboard, voice)
    └── pages/               # Views (boot.html, login.html, index.html)
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- Optional: [Ollama](https://ollama.ai/) running locally for offline LLM features

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/techashutosh03/PHANTOM.git
   cd PHANTOM
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Launch the system:
   ```bash
   npm start
   ```

4. Access the interface:
   - **Dashboard**: [http://localhost:5050](http://localhost:5050)
   - **Login**: [http://localhost:5050/pages/login.html](http://localhost:5050/pages/login.html)

---

## 🔒 Default Credentials

- **Username**: `commander`
- **Password**: `phantom2026`

---

## 📜 License

ISC License. Built for personal intelligence operations.
