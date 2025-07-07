let gameseq = [];
let userseq = [];

let started = false;
let level = 0;
let highScore = localStorage.getItem('simonHighScore') || 0;

let btns = ["red", "purple", "green", "yellow"];

let h2 = document.querySelector("h2");
let h3 = document.querySelector("h3");

// Update high score display on load
updateHighScoreDisplay();

document.addEventListener("keypress", function() {
    if (started == false) {
        console.log("game is started");
        started = true;
        levelUp();
    }
});

function gameFlash(btn) {
    btn.classList.add("flash");
    setTimeout(function() {
        btn.classList.remove("flash");
    }, 250);
}

function userFlash(btn) {
    btn.classList.add("userflash");
    setTimeout(function() {
        btn.classList.remove("userflash");
    }, 250);
}

function levelUp() {
    userseq = []; // Reset user sequence for new level
    level++;
    h2.innerText = `Level ${level}`;

    // Fixed: Random index should be 0-3 (4 colors), not 0-2
    let randIdx = Math.floor(Math.random() * 4);
    let randColor = btns[randIdx];
    let randbtn = document.querySelector(`.${randColor}`);
    gameseq.push(randColor);
    console.log(gameseq);
    
    // Add delay before showing the sequence
    setTimeout(() => {
        gameFlash(randbtn);
    }, 600);
}

function checkAns(idx) {
    if (userseq[idx] === gameseq[idx]) {
        if (userseq.length == gameseq.length) {
            // Add delay before next level
            setTimeout(() => {
                levelUp();
            }, 1000);
        }
    } else {
        // Update high score if current score is better
        if (level > highScore) {
            highScore = level;
            localStorage.setItem('simonHighScore', highScore);
            updateHighScoreDisplay();
        }
        
        h2.innerHTML = `Game Over! Your score was <b>${level}</b><br> Press any key to start.`;
        document.querySelector("body").style.backgroundColor = "red";
        setTimeout(function() {
            document.querySelector("body").style.backgroundColor = "white";
        }, 150);
        reset();
    }
}

function btnPress() {
    let btn = this;
    userFlash(btn);
    let userColor = btn.getAttribute("id");
    userseq.push(userColor);

    checkAns(userseq.length - 1);
}

function updateHighScoreDisplay() {
    if (h3) {
        h3.innerText = `High Score: ${highScore}`;
    }
}

let allBtns = document.querySelectorAll(".btn");
for (btn of allBtns) {
    btn.addEventListener("click", btnPress);
}

function reset() {
    started = false;
    gameseq = [];
    userseq = [];
    level = 0;
}

// Add sound effects
function playSound(color) {
    // Create audio context for sound effects
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const frequencies = {
        red: 329.63,    // E4
        yellow: 261.63, // C4
        green: 220.00,  // A3
        purple: 174.61  // F3
    };
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequencies[color];
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

// Enhanced game flash with sound
function gameFlash(btn) {
    btn.classList.add("flash");
    playSound(btn.id);
    setTimeout(function() {
        btn.classList.remove("flash");
    }, 250);
}

// Enhanced user flash with sound
function userFlash(btn) {
    btn.classList.add("userflash");
    playSound(btn.id);
    setTimeout(function() {
        btn.classList.remove("userflash");
    }, 250);
}