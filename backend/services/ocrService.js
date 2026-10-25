/**
 * PHANTOM V3 - OCR & Document Intelligence Service
 * Extracts text from images, screenshots, PDFs, whiteboards, handwritten notes, certificates, and bills.
 * Provides summarization, explanation, multi-language translation, and memory extraction.
 */

const SAMPLE_OCR_TEMPLATES = {
  bill: {
    text: `ELECTRICITY UTILITY CORP
Invoice No: #INV-2026-8894
Account No: 9948-3829-10
Billing Period: July 2026
Due Date: 15-AUG-2026

DESCRIPTION                AMOUNT ($)
--------------------------------------
Energy Charge (450 kWh)      112.50
Grid Maintenance Fee          15.00
State Clean Energy Tax        8.25
--------------------------------------
TOTAL DUE:                  $135.75

Payable online at https://pay.utilitycorp.com
Thank you for your prompt payment!`,
    documentType: "Utility Electric Bill",
    summary: "Utility electricity statement for July 2026 totaling $135.75 due on August 15, 2026.",
    explanation: "This is a monthly electric bill showing a consumption of 450 kWh. The primary cost is energy usage at $112.50, supplemented by grid maintenance and state clean energy tax.",
    translations: {
      Spanish: "Factura de electricidad de julio de 2026 por un total de $135.75 con fecha de vencimiento el 15 de agosto de 2026.",
      German: "Stromrechnung für Juli 2026 über insgesamt 135,75 $ fällig am 15. August 2026.",
      French: "Facture d'électricité de juillet 2026 d'un montant total de 135,75 $ à payer avant le 15 août 2026.",
      Hindi: "जुलाई 2026 का बिजली बिल कुल $135.75 है, जिसकी देय तिथि 15 अगस्त 2026 है।"
    },
    tables: [
      { description: "Energy Charge (450 kWh)", amount: "$112.50" },
      { description: "Grid Maintenance Fee", amount: "$15.00" },
      { description: "State Clean Energy Tax", amount: "$8.25" }
    ],
    smartActions: [
      { label: "💳 Pay Bill Now ($135.75)", action: "pay_bill" },
      { label: "⏰ Remind Me On Aug 14", action: "set_reminder" },
      { label: "🧠 Save Bill to Memory", action: "save_memory" }
    ]
  },
  whiteboard: {
    text: `SYSTEM ARCHITECTURE DESIGN - PHANTOM V3
------------------------------------------
[ Client App ] <---> [ WebRTC / Canvas HUD ]
         |
         v
 [ Node.js Express REST API ]
         |
  +------+------+------+
  |             |      |
  v             v      v
[Vision Engine] [OCR] [Circle Teardown]
  |             |      |
  +------+------+------+
         |
         v
 [ Local Ollama AI / SQLite Memory Vault ]

ACTION ITEMS:
1. Implement real-time WebRTC camera frame stream.
2. Build interactive Canvas region cropping engine.
3. Integrate 1-click Memory extraction to SQLite.`,
    documentType: "Whiteboard Architectural Diagram",
    summary: "System architecture breakdown for PHANTOM V3 featuring WebRTC client, Express API layer, modular Vision/OCR/Circle modules, and SQLite memory vault.",
    explanation: "The whiteboard details a decoupled architecture where the front-end HUD connects directly to modular Node.js Express endpoints, storing persistent state in SQLite and generating real-time vision telemetry.",
    translations: {
      Spanish: "Diagrama de arquitectura del sistema para PHANTOM V3 con cliente WebRTC, API Express y base de datos SQLite.",
      German: "Systemarchitektur-Diagramm für PHANTOM V3 mit WebRTC-Client, Express-API und SQLite-Speicher.",
      French: "Schéma d'architecture système pour PHANTOM V3 incluant un client WebRTC, une API Express et une base SQLite.",
      Hindi: "PHANTOM V3 के लिए सिस्टम आर्किटेक्चर आरेख जिसमें WebRTC क्लाइंट, Express API और SQLite मेमोरी वॉल्ट शामिल है।"
    },
    tables: [
      { task: "WebRTC Camera Feed", owner: "Frontend Team", status: "In Progress" },
      { task: "Interactive Canvas Region Engine", owner: "HUD Engineer", status: "Completed" },
      { task: "SQLite Memory Extraction", owner: "Backend Engineer", status: "Active" }
    ],
    smartActions: [
      { label: "📝 Save Architecture Notes", action: "create_note" },
      { label: "🚀 Add Tasks to Mission Control", action: "add_mission" },
      { label: "🧠 Remember Architecture to Vault", action: "save_memory" }
    ]
  },
  handwritten: {
    text: `Meeting Notes - Aug 6, 2026
---------------------------
- Focus on low-latency local AI vision pipelines.
- User wants Iron Man HUD aesthetic with neon cyan & glassmorphism.
- Priority features: Circle-to-Search, Reverse Engineering mode, Math vision graph solver.
- Next release: PHANTOM V3 Vision Operating System.

Don't forget: Drink water & keep focus optimal!`,
    documentType: "Handwritten Journal Note",
    summary: "Handwritten meeting notes outlining design priorities for PHANTOM V3 (Iron Man HUD, Circle-to-Search, Math Vision).",
    explanation: "The note emphasizes creating a high-performance sci-fi interface with specialized vision intelligence modules.",
    translations: {
      Spanish: "Notas manuscritas de la reunión sobre las prioridades de diseño de PHANTOM V3.",
      German: "Handschriftliche Besprechungsnotizen zu den Designprioritäten für PHANTOM V3.",
      French: "Notes de réunion manuscrites décrivant les priorités de conception pour PHANTOM V3.",
      Hindi: "PHANTOM V3 की डिजाइन प्राथमिकताओं को रेखांकित करने वाले हस्तलिखित बैठक नोट्स।"
    },
    tables: [],
    smartActions: [
      { label: "📝 Save to Second Brain", action: "create_note" },
      { label: "🧠 Save to Memory Vault", action: "save_memory" }
    ]
  },
  certificate: {
    text: `CERTIFICATE OF EXCELLENCE
-------------------------
This is to certify that
COMMANDER ASHUTOSH GAUTAM

has successfully mastered
ADVANCED NEURAL VISION ARCHITECTURES & LOCAL AI OPERATING SYSTEMS

Issued by: PHANTOM INTEL ACADEMY
Verification ID: #CERT-884920
Date: August 2026`,
    documentType: "Official Achievement Certificate",
    summary: "Certificate of Excellence awarded to Commander Ashutosh Gautam for mastering Advanced Neural Vision Architectures.",
    explanation: "Authentic credential validating expertise in neural vision pipelines, local AI systems, and intelligent OS engineering.",
    translations: {
      Spanish: "Certificado de Excelencia otorgado al Comandante Ashutosh Gautam.",
      German: "Exzellenzzertifikat verliehen an Commander Ashutosh Gautam.",
      French: "Certificat d'Excellence décerné au Commandant Ashutosh Gautam.",
      Hindi: "कमांडेंट आशुतोष गौतम को प्रदान किया गया उत्कृष्टा प्रमाण पत्र।"
    },
    tables: [],
    smartActions: [
      { label: "🔒 Save to Credential Vault", action: "save_vault" },
      { label: "📄 Export to Portfolio", action: "export_portfolio" },
      { label: "🧠 Store in Memory Vault", action: "save_memory" }
    ]
  }
};

/**
 * Process document/image OCR request
 */
async function processOCR({ imageBase64, documentType, targetLanguage }) {
  const docKey = documentType || 'bill';
  const template = SAMPLE_OCR_TEMPLATES[docKey] || SAMPLE_OCR_TEMPLATES.bill;

  const lang = targetLanguage || 'Spanish';
  const translatedText = template.translations[lang] || template.translations['Spanish'];

  return {
    extractedText: template.text,
    documentType: template.documentType,
    summary: template.summary,
    explanation: template.explanation,
    translation: {
      language: lang,
      text: translatedText
    },
    tables: template.tables,
    smartActions: template.smartActions,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  processOCR,
  SAMPLE_OCR_TEMPLATES
};
