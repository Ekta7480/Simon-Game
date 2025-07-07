let gameseq = [];
let userseq = [];

let started = false;
let level = 0;
let highScore = localStorage.getItem('simonHighScore') || 0;

// Three blocks are blue, one block is red (the different one)
let btns = ["blue1", "blue2", "blue3", "red"];
let differentBlock = "red"; // The block that's different from the others

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

// Add click to start functionality
document.querySelector(".start-btn").addEventListener("click", function() {
    if (started == false) {
        console.log("game is started");
        started = true;
        levelUp();
    }
});

function gameFlash(btn) {
    btn.classList.add("flash");
    playSound(btn.id);
    setTimeout(function() {
        btn.classList.remove("flash");
    }, 400);
}

function userFlash(btn) {
    btn.classList.add("userflash");
    playSound(btn.id);
    setTimeout(function() {
        btn.classList.remove("userflash");
    }, 250);
}

function levelUp() {
    userseq = []; // Reset user sequence for new level
    level++;
    h2.innerText = `Level ${level} - Watch the pattern!`;

    // Random index should be 0-3 (4 blocks)
    let randIdx = Math.floor(Math.random() * 4);
    let randColor = btns[randIdx];
    let randbtn = document.querySelector(`.${randColor}`);
    gameseq.push(randColor);
    console.log("Game sequence:", gameseq);
    
    // Show the entire sequence with delays
    showSequence();
}

function showSequence() {
    h2.innerText = `Level ${level} - Watch carefully!`;
    
    gameseq.forEach((color, index) => {
        setTimeout(() => {
            let btn = document.querySelector(`.${color}`);
            gameFlash(btn);
        }, (index + 1) * 800); // 800ms delay between each flash
    });
    
    // After showing sequence, prompt user to repeat
    setTimeout(() => {
        h2.innerText = `Level ${level} - Your turn! Repeat the pattern`;
    }, (gameseq.length + 1) * 800);
}

function checkAns(idx) {
    if (userseq[idx] === gameseq[idx]) {
        if (userseq.length == gameseq.length) {
            h2.innerText = `Level ${level} - Correct! Get ready for next level...`;
            // Add delay before next level
            setTimeout(() => {
                levelUp();
            }, 1500);
        }
    } else {
        // Update high score if current score is better
        if (level > highScore) {
            highScore = level;
            localStorage.setItem('simonHighScore', highScore);
            updateHighScoreDisplay();
            h2.innerHTML = `🎉 NEW HIGH SCORE! 🎉<br>Level ${level}<br>Press any key or click Start to play again`;
        } else {
            h2.innerHTML = `Game Over! You reached Level ${level}<br>Press any key or click Start to play again`;
        }
        
        document.querySelector("body").style.backgroundColor = "#e74c3c";
        setTimeout(function() {
            document.querySelector("body").style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
        }, 300);
        reset();
    }
}

function btnPress() {
    if (!started) return; // Don't allow clicks if game hasn't started
    
    let btn = this;
    userFlash(btn);
    let userColor = btn.getAttribute("id");
    userseq.push(userColor);
    
    console.log("User sequence:", userseq);
    checkAns(userseq.length - 1);
}

function updateHighScoreDisplay() {
    if (h3) {
        h3.innerText = `High Score: Level ${highScore}`;
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
        blue1: 261.63,  // C4
        blue2: 293.66,  // D4  
        blue3: 329.63,  // E4
        red: 440.00     // A4 - Higher pitch for the different block
    };
    
    const frequencyValue = frequencies[color];
    
    // Check if frequency value is valid and finite
    if (!frequencyValue || !Number.isFinite(frequencyValue)) {
        console.warn(`Invalid frequency for color: ${color}`);
        return;
    }
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequencyValue;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.4);
}