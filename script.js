// ===============================
// PHANTOM AUTH SYSTEM
// ===============================

if (
    localStorage.getItem("phantomAuth") !== "true"
    &&
    !window.location.href.includes("login.html")
) {
    window.location.href = "login.html";
}

function logout() {

    localStorage.removeItem("phantomAuth");

    window.location.href = "login.html";

}

// ===============================
// SOS SYSTEM
// ===============================

async function activateSOS() {

    try {

        const response =
        await fetch(
            "http://localhost:5000/sos"
        );

        const data =
        await response.json();

        document.getElementById(
            "sosResult"
        ).innerText =
        data.message;

    }
    catch(error){

        console.error(error);

        document.getElementById(
            "sosResult"
        ).innerText =
        "SOS Failed";

    }

}

// ===============================
// CHAT SYSTEM
// ===============================

async function sendMessage() {

    const msg =
    document.getElementById(
        "message"
    ).value;

    if(!msg.trim()) return;

    try {

        const response =
        await fetch(
            "http://localhost:5000/chat",
            {
                method:"POST",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:JSON.stringify({
                    message:msg
                })
            }
        );

        const data =
        await response.json();

        const chatBox =
        document.getElementById(
            "chatBox"
        );

        chatBox.innerHTML +=
        `
        <p><strong>You:</strong>
        ${escapeHtml(msg)}</p>

        <p><strong>PHANTOM:</strong>
        ${escapeHtml(data.reply)}</p>
        `;

        detectEmotion(msg);

        speak(data.reply);

        document.getElementById(
            "message"
        ).value = "";

    }
    catch(error){

        console.error(error);

    }

}

// ===============================
// MEMORY VAULT
// ===============================

async function saveNote() {

    const note =
    document.getElementById(
        "noteInput"
    ).value;

    if(!note.trim()) return;

    try {

        await fetch(
            "http://localhost:5000/notes",
            {
                method:"POST",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:JSON.stringify({
                    content:note
                })
            }
        );

        document.getElementById(
            "noteInput"
        ).value = "";

        loadNotes();

    }
    catch(error){

        console.error(error);

    }

}

async function loadNotes() {

    try {

        const response =
        await fetch(
            "http://localhost:5000/notes"
        );

        const notes =
        await response.json();

        let html = "";

        notes.forEach(note => {

            html +=
            `
            <p>🧠
            ${escapeHtml(note.content)}
            </p>
            `;

        });

        const container =
        document.getElementById(
            "savedNotes"
        );

        if(container){

            container.innerHTML =
            html;

        }

    }
    catch(error){

        console.error(error);

    }

}

// ===============================
// MISSION CONTROL
// ===============================

async function addMission() {

    const title =
    document.getElementById(
        "missionInput"
    ).value;

    if(!title.trim()) return;

    try {

        await fetch(
            "http://localhost:5000/missions",
            {
                method:"POST",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:JSON.stringify({
                    title:title
                })
            }
        );

        document.getElementById(
            "missionInput"
        ).value = "";

        loadMissions();

    }
    catch(error){

        console.error(error);

    }

}

async function loadMissions() {

    try {

        const response =
        await fetch(
            "http://localhost:5000/missions"
        );

        const missions =
        await response.json();

        let html = "";

        missions.forEach(mission => {

            html +=
            `
            <li>
            🎯 ${escapeHtml(mission.title)}
            </li>
            `;

        });

        document.getElementById(
            "missions"
        ).innerHTML =
        html;

    }
    catch(error){

        console.error(error);

    }

}

// ===============================
// EMOTION ENGINE
// ===============================

function detectEmotion(text){

    text =
    text.toLowerCase();

    let emotion =
    "Neutral";

    if(
        text.includes("sad")
        ||
        text.includes("depressed")
    ){
        emotion = "Sad";
    }

    if(
        text.includes("happy")
        ||
        text.includes("joy")
    ){
        emotion = "Happy";
    }

    if(
        text.includes("angry")
        ||
        text.includes("mad")
    ){
        emotion = "Angry";
    }

    if(
        text.includes("stress")
        ||
        text.includes("anxious")
    ){
        emotion = "Stressed";
    }

    const box =
    document.getElementById(
        "emotionStatus"
    );

    if(box){

        box.innerText =
        "Detected Emotion: " +
        emotion;

    }

}

// ===============================
// VOICE RESPONSE
// ===============================

function speak(text){

    window.speechSynthesis.cancel();

    const speech =
    new SpeechSynthesisUtterance(
        text
    );

    speech.rate = 1;
    speech.pitch = 1;

    speechSynthesis.speak(
        speech
    );

}

// ===============================
// VOICE INPUT
// ===============================

function startVoice(){

    if(
        !(
            "webkitSpeechRecognition"
            in window
        )
    ){
        alert(
            "Voice Recognition Not Supported"
        );
        return;
    }

    const recognition =
    new webkitSpeechRecognition();

    recognition.lang =
    "en-US";

    recognition.start();

    recognition.onresult =
    function(event){

        document.getElementById(
            "message"
        ).value =
        event.results[0][0]
        .transcript;

    };

}

// ===============================
// SECURITY
// ===============================

function escapeHtml(text){

    const div =
    document.createElement(
        "div"
    );

    div.textContent =
    text;

    return div.innerHTML;

}

// ===============================
// INITIALIZE PHANTOM
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function(){

        loadNotes();

        loadMissions();

        const voiceBtn =
        document.getElementById(
            "voiceBtn"
        );

        if(voiceBtn){

            voiceBtn.addEventListener(
                "click",
                startVoice
            );

        }

        const messageInput =
        document.getElementById(
            "message"
        );

        if(messageInput){

            messageInput
            .addEventListener(
                "keypress",
                function(event){

                    if(
                        event.key ===
                        "Enter"
                    ){

                        event.preventDefault();

                        sendMessage();

                    }

                }
            );

        }

    }
);
function updateClock(){

const now =
new Date();

document.getElementById(
"clock"
).innerText =
now.toLocaleTimeString();

}

setInterval(
updateClock,
1000
);

updateClock();