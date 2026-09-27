/* =========================================================
   CHATFLOW
   Real-Time Chat App - Frontend Only
========================================================= */


/* =========================================================
   STORAGE KEYS
========================================================= */

const STORAGE_KEY =
    "chatflow_messages_v1";

const THEME_KEY =
    "chatflow_theme_v1";

const SOUND_KEY =
    "chatflow_sound_v1";


/* =========================================================
   DOM ELEMENTS
========================================================= */

const messagesEl =
    document.getElementById("messages");

const form =
    document.getElementById("chatForm");

const input =
    document.getElementById("messageInput");

const charCount =
    document.getElementById("charCount");

const typingIndicator =
    document.getElementById("typingIndicator");

const quickReplies =
    document.getElementById("quickReplies");

const sidebarPreview =
    document.getElementById("sidebarPreview");

const toast =
    document.getElementById("toast");

const emojiBtn =
    document.getElementById("emojiBtn");

const emojiPanel =
    document.getElementById("emojiPanel");

const themeBtn =
    document.getElementById("themeBtn");

const soundBtn =
    document.getElementById("soundBtn");

const infoBtn =
    document.getElementById("infoBtn");

const infoModal =
    document.getElementById("infoModal");

const modalClose =
    document.getElementById("modalClose");

const clearBtn =
    document.getElementById("clearBtn");

const attachBtn =
    document.getElementById("attachBtn");

const fileInput =
    document.getElementById("fileInput");

const searchInput =
    document.getElementById("searchInput");

const messageCount =
    document.getElementById("messageCount");

const modeText =
    document.getElementById("modeText");


/* =========================================================
   STATE
========================================================= */

let soundEnabled =
    localStorage.getItem(SOUND_KEY) !== "off";

let messages =
    loadMessages();


/* =========================================================
   BOT RESPONSES
========================================================= */

const botReplies = [

    "Thanks for your message! 👋",

    "I'm your frontend chat assistant. I can respond with predefined messages.",

    "Nice! This interface uses HTML, CSS, JavaScript and localStorage.",

    "Tip: Your chat history stays here even after refreshing the page.",

    "You can also try the emoji button, theme switcher, search, timestamps and clear-chat controls. ✨",

    "This is frontend-only, so the chatbot response is simulated locally.",

    "Great question! For a real multi-user chat, a backend and WebSocket technology such as Socket.IO would be added."

];


/* =========================================================
   LOAD MESSAGES
========================================================= */

function loadMessages() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(STORAGE_KEY)
            );

        if (
            Array.isArray(saved) &&
            saved.length
        ) {

            return saved;

        }

    } catch (error) {

        console.warn(
            "Could not load saved messages.",
            error
        );

    }


    return [

        {

            id:
                crypto.randomUUID
                    ? crypto.randomUUID()
                    : Date.now(),

            sender:
                "received",

            text:
                "Welcome to ChatFlow! 👋 Send me a message and I’ll reply instantly.",

            time:
                getTime()

        }

    ];

}


/* =========================================================
   SAVE MESSAGES
========================================================= */

function saveMessages() {

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(messages)

    );

}


/* =========================================================
   TIME
========================================================= */

function getTime(
    date = new Date()
) {

    return date.toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value;

    return div.innerHTML;

}


/* =========================================================
   RENDER MESSAGES
========================================================= */

function renderMessages(
    filter = ""
) {

    const query =
        filter.trim().toLowerCase();


    if (!messages.length) {

        messagesEl.innerHTML = `

            <div class="empty-chat">

                <div>

                    <div class="empty-icon">
                        💬
                    </div>

                    <strong>
                        No messages yet
                    </strong>

                    <p>
                        Start the conversation using
                        the message box below.
                    </p>

                </div>

            </div>

        `;

        updateStats();

        return;

    }


    const filtered =
        messages.filter(
            message =>
                message.text
                    .toLowerCase()
                    .includes(query)
        );


    if (!filtered.length) {

        messagesEl.innerHTML = `

            <div class="empty-chat">

                <div>

                    <div class="empty-icon">
                        🔎
                    </div>

                    <strong>
                        No matching messages
                    </strong>

                    <p>
                        Try another keyword.
                    </p>

                </div>

            </div>

        `;

        updateStats();

        return;

    }


    messagesEl.innerHTML =

        filtered
            .map(message => `

                <div
                    class="message-row ${message.sender}"
                    data-id="${message.id}"
                >

                    ${
                        message.sender === "received"

                            ? `
                                <div class="avatar small">
                                    CF
                                </div>
                            `

                            : ""
                    }


                    <div class="message-bubble">

                        <div class="message-text">
                            ${escapeHTML(message.text)}
                        </div>

                        <div class="message-meta">

                            <span>
                                ${message.time}
                            </span>

                            ${
                                message.sender === "sent"

                                    ? `
                                        <span class="check">
                                            ✓✓
                                        </span>
                                    `

                                    : ""
                            }

                        </div>

                    </div>

                </div>

            `)
            .join("");


    updateStats();


    if (!filter) {

        scrollToBottom();

    }

}


/* =========================================================
   UPDATE STATS
========================================================= */

function updateStats() {

    messageCount.textContent =
        messages.length;


    sidebarPreview.textContent =

        messages.length

            ? messages[messages.length - 1].text

            : "No messages yet";

}


/* =========================================================
   SCROLL TO BOTTOM
========================================================= */

function scrollToBottom() {

    requestAnimationFrame(() => {

        messagesEl.scrollTop =
            messagesEl.scrollHeight;

    });

}


/* =========================================================
   ADD MESSAGE
========================================================= */

function addMessage(
    text,
    sender = "sent"
) {

    const clean =
        text.trim();


    if (!clean) {

        return;

    }


    messages.push({

        id:
            crypto.randomUUID
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random()}`,

        sender,

        text:
            clean,

        time:
            getTime()

    });


    saveMessages();

    renderMessages();

    playNotification();

}


/* =========================================================
   TYPING INDICATOR
========================================================= */

function showTyping() {

    typingIndicator.hidden =
        false;

    scrollToBottom();

}


function hideTyping() {

    typingIndicator.hidden =
        true;

}


/* =========================================================
   BOT LOGIC
========================================================= */

function getBotReply(
    userText
) {

    const text =
        userText.toLowerCase();


    if (
        text.includes("hello") ||
        text.includes("hi")
    ) {

        return "Hello! 👋 Nice to chat with you. How can I help?";

    }


    if (
        text.includes("what can you do")
    ) {

        return `
I can demonstrate a frontend chat experience with instant UI updates, timestamps, localStorage, quick replies, emoji support, search, dark mode and simulated responses.
        `.trim();

    }


    if (
        text.includes("tip")
    ) {

        return `
Developer tip: Keep your UI state in JavaScript and persist only the data you actually need in localStorage.
        `.trim();

    }


    if (
        text.includes("thank")
    ) {

        return "You're welcome! 😊";

    }


    return botReplies[
        Math.floor(
            Math.random() *
            botReplies.length
        )
    ];

}


/* =========================================================
   SEND MESSAGE
========================================================= */

function sendMessage(
    text = input.value
) {

    const clean =
        text.trim();


    if (!clean) {

        return;

    }


    addMessage(
        clean,
        "sent"
    );


    input.value = "";


    resizeTextarea();

    updateCharCount();


    quickReplies.style.display =
        "none";


    showTyping();


    const delay =
        650 +
        Math.floor(
            Math.random() * 650
        );


    setTimeout(() => {

        hideTyping();


        addMessage(
            getBotReply(clean),
            "received"
        );


        quickReplies.style.display =
            "flex";

    }, delay);

}


/* =========================================================
   TEXTAREA RESIZE
========================================================= */

function resizeTextarea() {

    input.style.height =
        "auto";


    input.style.height =
        `${Math.min(
            input.scrollHeight,
            120
        )}px`;

}


/* =========================================================
   CHARACTER COUNTER
========================================================= */

function updateCharCount() {

    charCount.textContent =
        `${input.value.length} / 500`;

}


/* =========================================================
   TOAST
========================================================= */

function showToast(
    message
) {

    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        showToast.timer
    );


    showToast.timer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2200);

}


/* =========================================================
   SOUND
========================================================= */

function playNotification() {

    if (!soundEnabled) {

        return;

    }


    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        if (!AudioContext) {

            return;

        }


        const context =
            new AudioContext();


        const oscillator =
            context.createOscillator();


        const gain =
            context.createGain();


        oscillator.frequency.value =
            720;


        oscillator.type =
            "sine";


        gain.gain.setValueAtTime(
            0.035,
            context.currentTime
        );


        gain.gain.exponentialRampToValueAtTime(
            0.001,
            context.currentTime + 0.12
        );


        oscillator.connect(
            gain
        );


        gain.connect(
            context.destination
        );


        oscillator.start();


        oscillator.stop(
            context.currentTime + 0.12
        );

    } catch {

        // Browser audio may be blocked.

    }

}


/* =========================================================
   FORM SUBMIT
========================================================= */

form.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        sendMessage();

    }
);


/* =========================================================
   INPUT
========================================================= */

input.addEventListener(
    "input",
    () => {

        resizeTextarea();

        updateCharCount();

    }
);


/* =========================================================
   ENTER TO SEND
========================================================= */

input.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);


/* =========================================================
   QUICK REPLIES
========================================================= */

quickReplies.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "button"
            );


        if (!button) {

            return;

        }


        sendMessage(
            button.dataset.message
        );

    }
);


/* =========================================================
   EMOJI BUTTON
========================================================= */

emojiBtn.addEventListener(
    "click",
    () => {

        emojiPanel.classList.toggle(
            "show"
        );

    }
);


/* =========================================================
   EMOJI SELECTION
========================================================= */

emojiPanel.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "button"
            );


        if (!button) {

            return;

        }


        const start =
            input.selectionStart;


        const end =
            input.selectionEnd;


        const emoji =
            button.textContent;


        input.value =

            input.value.slice(
                0,
                start
            )

            +

            emoji

            +

            input.value.slice(
                end
            );


        input.focus();


        input.selectionStart =
            input.selectionEnd =
                start + emoji.length;


        resizeTextarea();

        updateCharCount();

    }
);


/* =========================================================
   CLOSE EMOJI
========================================================= */

document.addEventListener(
    "click",
    event => {

        if (
            !event.target.closest(
                ".input-wrap"
            ) &&
            !event.target.closest(
                "#emojiBtn"
            )
        ) {

            emojiPanel.classList.remove(
                "show"
            );

        }

    }
);


/* =========================================================
   THEME
========================================================= */

themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark"
        );


        const dark =
            document.body.classList.contains(
                "dark"
            );


        localStorage.setItem(
            THEME_KEY,
            dark
                ? "dark"
                : "light"
        );


        themeBtn.textContent =
            dark
                ? "☀️"
                : "🌙";


        modeText.textContent =
            dark
                ? "Dark"
                : "Light";


        showToast(
            `${dark ? "Dark" : "Light"} mode enabled`
        );

    }
);


/* =========================================================
   LOAD THEME
========================================================= */

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            THEME_KEY
        );


    const dark =
        savedTheme === "dark";


    document.body.classList.toggle(
        "dark",
        dark
    );


    themeBtn.textContent =
        dark
            ? "☀️"
            : "🌙";


    modeText.textContent =
        dark
            ? "Dark"
            : "Light";

}


/* =========================================================
   SOUND TOGGLE
========================================================= */

soundBtn.addEventListener(
    "click",
    () => {

        soundEnabled =
            !soundEnabled;


        localStorage.setItem(
            SOUND_KEY,
            soundEnabled
                ? "on"
                : "off"
        );


        soundBtn.textContent =
            soundEnabled
                ? "🔔"
                : "🔕";


        showToast(
            soundEnabled
                ? "Notification sound on"
                : "Notification sound off"
        );

    }
);


/* =========================================================
   INFORMATION MODAL
========================================================= */

infoBtn.addEventListener(
    "click",
    () => {

        infoModal.classList.add(
            "open"
        );


        infoModal.setAttribute(
            "aria-hidden",
            "false"
        );

    }
);


function closeModal() {

    infoModal.classList.remove(
        "open"
    );


    infoModal.setAttribute(
        "aria-hidden",
        "true"
    );

}


modalClose.addEventListener(
    "click",
    closeModal
);


infoModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            infoModal
        ) {

            closeModal();

        }

    }
);


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeModal();

            emojiPanel.classList.remove(
                "show"
            );

        }

    }
);


/* =========================================================
   CLEAR CHAT
========================================================= */

clearBtn.addEventListener(
    "click",
    () => {

        if (!messages.length) {

            showToast(
                "Chat is already empty"
            );

            return;

        }


        const confirmed =
            confirm(
                "Clear all chat messages? This cannot be undone."
            );


        if (!confirmed) {

            return;

        }


        messages = [];


        saveMessages();

        renderMessages();


        quickReplies.style.display =
            "flex";


        showToast(
            "Chat history cleared"
        );

    }
);


/* =========================================================
   ATTACHMENT
========================================================= */

attachBtn.addEventListener(
    "click",
    () => {

        fileInput.click();

    }
);


fileInput.addEventListener(
    "change",
    () => {

        const file =
            fileInput.files[0];


        if (!file) {

            return;

        }


        input.value =
            `📎 ${file.name}`;


        updateCharCount();

        resizeTextarea();

        input.focus();


        showToast(
            "Attachment selected — frontend demo only"
        );

    }
);


/* =========================================================
   SEARCH
========================================================= */

searchInput.addEventListener(
    "input",
    () => {

        renderMessages(
            searchInput.value
        );

    }
);


/* =========================================================
   PROFILE
========================================================= */

document
    .getElementById("profileBtn")
    .addEventListener(
        "click",
        () => {

            showToast(
                "Profile menu is ready for future backend integration"
            );

        }
    );


/* =========================================================
   INITIALIZE
========================================================= */

loadTheme();


soundBtn.textContent =
    soundEnabled
        ? "🔔"
        : "🔕";


renderMessages();


updateCharCount();


resizeTextarea();