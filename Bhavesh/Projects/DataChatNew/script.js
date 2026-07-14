// voice to text
const micbtn = document.getElementById("micbtn")
const chatingZone = document.getElementById("chatingZone")
const listen = window.SpeechRecognition || window.webkitSpeechRecognition;
const listener = new listen();
listener.continuous = false;
listener.lang = "en-US";
micbtn.addEventListener("click", () => {
    micbtn.style.background = "red"
    listener.start()
});
chatingZone.value = "";
listener.onresult = (event) => {
    const result = event.results[0][0].transcript;
    chatingZone.value = result;
}

// sending message
const chatShows = document.getElementById("chats")
const sendbtn = document.getElementById("sendbtn")
const fileInput = document.getElementById("fileUplod");

sendbtn.addEventListener("click", () => {
    const userMessage = chatingZone.value.trim();
    if (userMessage === "") return;

    const userMessageNew = document.createElement("div");
    userMessageNew.classList.add("message", "user");
    userMessageNew.innerText = userMessage;
    chatShows.appendChild(userMessageNew);
    DataChatReply(userMessage)
    chatShows.style.justifyContent = "flex-start";
    chatingZone.value = "";
    fileInput.value = "";

    chatShows.scrollTop = chatShows.scrollHeight;
});
chatingZone.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        sendbtn.click();
    }
})

// ai reply
async function DataChatReply(message) {
 {
        const eReply = {
            "tell me about bhavesh education": "Bhavesh Sharma is curruntly pursuing BTech in Computer Science Engineering at Lakshmi devi institute of technology and Engeneering Alwar rajsthan . He want to be a best frontend Devloper and web pentester . And also this AiChatbot is also made by Bhavesh Sharma . If you want to know about me please check my portfolio website where i attached my skills projects and many more My gmail:-   Bhaveshyt.infinity@gmail.com",
            "who is bhavesh": "Founder of ChatFinity Ai is Bhavesh Sharma  Here is Bhavesh portfolio website: github.io/bhavesh189/portfolio"
        }
        const userMsgLower = message.toLowerCase()
        const loadingMessage = document.createElement("div");
        loadingMessage.classList.add("message", "dataChat");
        loadingMessage.innerText = "Please Wait I Am Thinking...";
        chatShows.appendChild(loadingMessage);
        chatShows.scrollTop = chatShows.scrollHeight;
        if (eReply[userMsgLower]) {
            setTimeout(() => {
                loadingMessage.innerText = eReply[userMsgLower]
                chatShows.scrollTop = chatShows.scrollHeight
            }, 800)
            return;
        }
    }
    try {
        const res = await fetch("https://datachatbackend.onrender.com/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: message })
        });


        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Backend reply:", data);
        return data.reply;
    } catch (err) {
        console.error("Fetch error:", err);
        return "Sorry, something went wrong!";
    }
}

//sidebar
let sidebar = document.querySelector(".sidebar")
let threedots = document.querySelector(".toggle-btn")
threedots.addEventListener("click", () => {
    sidebar.classList.toggle("active")
});
//google login on click event
const account = document.querySelector(".account")
const googleLogin = document.getElementById("googleLogin")
account.addEventListener("click", () => {
    googleLogin.classList.toggle("active")
});
//logout logic
const logoutBar = document.querySelector(".logoutBar")

const logoutOptions = document.querySelector(".logout")
logoutBar.addEventListener("click", () => {
    logoutOptions.classList.toggle("active")
});
// adding portfolio website
window.addEventListener("DOMContentLoaded", () => {
    const inputBox = document.getElementById("chatingZone")

    const params = new URLSearchParams(window.location.search)
    const autoPrompt = params.get("prompt")

    if (autoPrompt) {
        inputBox.value = decodeURIComponent(autoPrompt)
        sendbtn.click()
    }
});