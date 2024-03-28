const cursor = document.querySelector('.cursor');
const holes = [...document.querySelectorAll('.hole')];
const scoreEl = document.querySelector('.score span');
const startButton = document.querySelector('.start-button');
const countdownEl = document.getElementById('countdown'); // Add this line
let score = 0;
let gameTimer;
let moleTimers = [];
let sound; // Declare sound variable globally
const moleImages = [
    '1.png',
    '2.png',
    '3.png',
    '4.png',
    '5.png',
    '6.png',
    '7.png',
    '8.png'
];

function getRandomInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function run() {
    if (!gameTimer) return; // Stop generating moles if gameTimer is not set

    const numMoles = getRandomInterval(1, 6); // Random number of moles to appear (1 to 4)
    const holesIndexes = [];
    while (holesIndexes.length < numMoles) {
        const randomIndex = Math.floor(Math.random() * holes.length);
        if (!holesIndexes.includes(randomIndex)) {
            holesIndexes.push(randomIndex);
        }
    }

    holesIndexes.forEach(index => {
        const hole = holes[index];

        const img = document.createElement('img');
        img.classList.add('mole');
        const randomMoleImage = moleImages[Math.floor(Math.random() * moleImages.length)];
        img.src = randomMoleImage;

        sound = new Audio("smash.mp3"); // Create new Audio object
        img.addEventListener('click', (event) => {
            const holeRect = hole.getBoundingClientRect();
            const holeCenterX = holeRect.left + holeRect.width / 2;
            const holeCenterY = holeRect.top + holeRect.height / 2;
            const clickX = event.clientX;
            const clickY = event.clientY;
            const distance = Math.sqrt(Math.pow(clickX - holeCenterX, 2) + Math.pow(clickY - holeCenterY, 2));
            if (distance <= holeRect.width / 2) {
                score += 10;
                sound.currentTime = 0; // Reset audio playback to start
                sound.play(); // Play audio for the current mole
                scoreEl.textContent = score;
                hole.removeChild(img); // Remove the mole immediately upon whacking
            }
        });

        hole.appendChild(img);

        // Schedule the removal of the mole after a fixed duration
        const moleDuration = getRandomInterval(1500, 2000); // Random duration between 800ms and 1500ms
        const moleTimer = setTimeout(() => {
            hole.removeChild(img); // Remove the mole after its appearance duration
        }, moleDuration);
        moleTimers.push(moleTimer);
    });

    // Generate another set of moles after a fixed interval
    const nextMoleInterval = 2000; // Fixed interval between each set of mole appearances
    setTimeout(() => {
        run(); // Generate another set of moles
    }, nextMoleInterval);
}

function startGame() {
    startButton.disabled = true;
    document.body.classList.add('game-started');
    score = 0; // Reset score to 0
    scoreEl.textContent = score; // Update score display
    moleTimers = []; // Reset mole timers array

    // Countdown timer for 30 seconds
    let timeLeft = 30; // Set initial time
    countdownEl.textContent = timeLeft; // Display initial time
    const countdownInterval = setInterval(() => {
        timeLeft--; // Decrement time
        countdownEl.textContent = timeLeft; // Update displayed time
        if (timeLeft === 0) {
            clearInterval(countdownInterval); // Clear the countdown interval when time runs out
            endGame(); // End the game
        }
    }, 1000); // Update time every second

    // Schedule the end of the game after 30 seconds
    gameTimer = setTimeout(() => {
        endGame();
    }, 30000);

    // Call run function to start generating moles immediately after setting up the game
    run();
}

function endGame() {
    startButton.disabled = false;
    document.body.classList.remove('game-started');
    // Clear all mole appearance timers
    moleTimers.forEach(timer => clearTimeout(timer));
    gameTimer = null; // Reset gameTimer to null
}

startButton.addEventListener('click', startGame);

window.addEventListener('mousemove', e => {
    cursor.style.top = e.pageY + 'px';
    cursor.style.left = e.pageX + 'px';
});

window.addEventListener('mousedown', () => {
    cursor.classList.add('active');
});

window.addEventListener('mouseup', () => {
    cursor.classList.remove('active');
});
const customizeButton = document.querySelector('.customize-button');

customizeButton.addEventListener('click', () => {
    // Open customization interface
    openCustomizationInterface();
});

function openCustomizationInterface() {
    // Implement logic to open the customization interface here
    // You can display a modal or overlay with input fields for selecting custom images
    // Allow users to upload images from their local storage and replace the default mole images
}
