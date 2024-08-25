let sentences = {
    beginner: ["The quick brown fox jumps over the lazy dog.", "Hello world!", "JavaScript is fun."],
    intermediate: ["Typing tests improve speed and accuracy.", "Practice makes perfect.", "Consistency is key to improvement."],
    pro: ["Advanced level sentences challenge your typing skills.", "Achieving high accuracy is crucial for fast typists.", "The quick brown fox jumps over the lazy dog with accuracy and speed."]
};

let currentSentence = "";
let timer = 60;
let interval;
let level = "beginner";
let typedChars = 0;
let correctChars = 0;

function setLevel(selectedLevel) {
    level = selectedLevel;
    resetTest();
}

function startTest() {
    resetTest();
    currentSentence = sentences[level][Math.floor(Math.random() * sentences[level].length)];
    document.getElementById("sentence").innerHTML = highlightWords(currentSentence, 0);
    document.getElementById("input-field").focus();
    interval = setInterval(updateTimer, 1000);
}


function resetTest() {
    clearInterval(interval);
    timer = 60;
    typedChars = 0;
    correctChars = 0;
    document.getElementById("time").innerText = "Time: 60s";
    document.getElementById("score").innerText = "WPM: 0";
    document.getElementById("accuracy").innerText = "Accuracy: 0%";
    document.getElementById("input-field").value = "";
    document.getElementById("sentence").innerText = "";
    document.getElementById("feedback").innerText = "";
    document.getElementById("last-sentence").innerText = "";
    document.getElementById("last-stats").innerText = "";
}

function updateTimer() {
    timer--;
    document.getElementById("time").innerText = `Time: ${timer}s`;
    if (timer <= 0) {
        endTest();
    }
}

function highlightWords(sentence, correctLength) {
    let correctPart = sentence.slice(0, correctLength);
    let restPart = sentence.slice(correctLength);
    return `<span style="color: green;">${correctPart}</span>${restPart}`;
}

document.getElementById("input-field").addEventListener("input", function () {
    let typedText = this.value;
    typedChars = typedText.length;

    if (currentSentence.startsWith(typedText)) {
        document.getElementById("sentence").innerHTML = highlightWords(currentSentence, typedChars);
        document.getElementById("feedback").innerText = "";
        correctChars = typedText.length;

        // Check if the full sentence is typed correctly
        if (typedText === currentSentence) {
            clearInterval(interval);
            endTest();
        }
    } else {
        document.getElementById("feedback").innerHTML = `<span id="error">Incorrect</span>`;
        correctChars = getCorrectCharCount(currentSentence, typedText);
    }

    updateStats();
});

function getCorrectCharCount(sentence, typedText) {
    let correctCount = 0;
    for (let i = 0; i < Math.min(sentence.length, typedText.length); i++) {
        if (sentence[i] === typedText[i]) {
            correctCount++;
        }
    }
    return correctCount;
}

function updateStats() {
    let wordsTyped = Math.floor(correctChars / 5);
    let minutesElapsed = (60 - timer) / 60;
    let wpm = Math.round(minutesElapsed > 0 ? wordsTyped / minutesElapsed : 0);
    let accuracy = typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 0;

    document.getElementById("score").innerText = `WPM: ${wpm}`;
    document.getElementById("accuracy").innerText = `Accuracy: ${accuracy}%`;
}

function endTest() {
    clearInterval(interval);
    let wordsTyped = Math.floor(correctChars / 5);
    let minutesElapsed = (60 - timer) / 60;
    let wpm = Math.round(minutesElapsed > 0 ? wordsTyped / minutesElapsed : 0);
    let accuracy = typedChars > 0 ? Math.round((correctChars / typedChars) * 100) : 0;

    document.getElementById("last-sentence").innerText = currentSentence;
    document.getElementById("last-stats").innerText = `WPM: ${wpm}, Accuracy: ${accuracy}%`;

    showAnimation(wpm);
    saveScore(wpm, accuracy);
    resetTest();
}

// function showAnimation(wpm) {
//     const animationContainer = document.getElementById("animation-container");
//     animationContainer.innerHTML = "";

//     let animationElement;

//     if (wpm < 30) {
//         animationElement = document.createElement("div");
//         animationElement.className = "hot-air-balloon";
//     } else if (wpm >= 30 && wpm < 60) {
//         animationElement = document.createElement("div");
//         animationElement.className = "plane";
//     } else {
//         animationElement = document.createElement("div");
//         animationElement.className = "rocket";
//     }

//     animationContainer.appendChild(animationElement);
// }
function showAnimation(wpm) {
    const animationContainer = document.getElementById("animation-container");
    animationContainer.innerHTML = "";

    let animationElement;

    if (wpm < 30) {
        animationElement = document.createElement("div");
        animationElement.className = "hot-air-balloon";
    } else if (wpm >= 30 && wpm < 60) {
        animationElement = document.createElement("div");
        animationElement.className = "plane";
    } else {
        animationElement = document.createElement("div");
        animationElement.className = "rocket";
    }

    animationElement.style.backgroundSize = 'contain';
    animationElement.style.backgroundRepeat = 'no-repeat';
    animationElement.style.width = '100px'; // Adjust the size to suit your needs
    animationElement.style.height = '150px';

    animationContainer.appendChild(animationElement);
}



function saveScore(wpm, accuracy) {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ wpm, accuracy });
    leaderboard.sort((a, b) => b.wpm - a.wpm);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    updateLeaderboard();
}

function updateLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    let leaderboardList = document.getElementById("leaderboard-list");
    leaderboardList.innerHTML = "";
    leaderboard.slice(0, 5).forEach((score, index) => {
        leaderboardList.innerHTML += `<li>${index + 1}. WPM: ${score.wpm}, Accuracy: ${score.accuracy}%</li>`;
    });
}

// function toggleTheme() {
//     document.body.classList.toggle("light-theme");
// }

// ....
let currentTheme = "dark";

function toggleTheme() {
    if (currentTheme === "dark") {
        document.body.classList.remove("dark-blue-theme");
        document.body.classList.add("light-theme");
        currentTheme = "light";
    } else if (currentTheme === "light") {
        document.body.classList.remove("light-theme");
        document.body.classList.add("dark-blue-theme");
        currentTheme = "dark-blue";
    } else {
        document.body.classList.remove("dark-blue-theme");
        currentTheme = "dark";
    }
}

//...
function convertToAudio(sentence) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(sentence);

    utterance.rate = 1; // Set the speed of the speech
    utterance.pitch = 1; // Set the pitch of the voice
    utterance.volume = 1; // Set the volume level

    synth.speak(utterance);
}
