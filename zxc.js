document.addEventListener('DOMContentLoaded', function() {
    const passwordModal = document.getElementById('password-modal');
    const passwordInput = document.getElementById('password-input');
    const passwordSubmit = document.getElementById('password-submit');
    const passwordError = document.getElementById('password-error');
    const gameContent = document.getElementById('game-content');

    const correctPassword = 'room125';

    // Function to show error message
    function showError(message) {
        passwordError.textContent = message;
        passwordError.style.display = 'block';
    }

    // Function to hide the password modal
    function hidePasswordModal() {
        passwordModal.style.display = 'none';
        gameContent.style.display = 'block'; // Show the game content
    }

    // Event listener for password submit button
    passwordSubmit.addEventListener('click', function() {
        const password = passwordInput.value.trim();
        if (password === correctPassword) {
            hidePasswordModal();
        } else {
            showError('Incorrect password. Please try again.');
        }
    });

    // Optional: Allow pressing Enter key to submit password
    passwordInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            passwordSubmit.click();
        }
    });
});

const cursor = document.querySelector('.cursor');
const holes = [...document.querySelectorAll('.hole')];
const scoreEl = document.querySelector('.score span');
const startButton = document.querySelector('.start-button');
const countdownEl = document.getElementById('countdown');
const customizeButton = document.querySelector('.customize-button');
const closeButton = document.querySelector('.close-button');

let score = 0;
let gameTimer;
let moleTimers = [];
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

let customMoleImages = [...moleImages]; // Initialize with default mole images
let customMoleVoices = Array(moleImages.length).fill(null); // Initialize with null voices

// Variable to hold the currently playing audio
let currentAudio = null;

function getRandomInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function run() {
    if (!gameTimer) return;

    const numMoles = getRandomInterval(1, 6);
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

        // Use the customized mole image if available, otherwise use a random default mole image
        const moleImage = customMoleImages[index] || getRandomDefaultMoleImage();
        img.src = moleImage;

        img.addEventListener('click', (event) => {
            const holeRect = hole.getBoundingClientRect();
            const holeCenterX = holeRect.left + holeRect.width / 2;
            const holeCenterY = holeRect.top + holeRect.height / 2;
            const clickX = event.clientX;
            const clickY = event.clientY;
            const distance = Math.sqrt(Math.pow(clickX - holeCenterX, 2) + Math.pow(clickY - holeCenterY, 2));
            if (distance <= holeRect.width / 2) {
                score += 10;
                scoreEl.textContent = score;
                hole.removeChild(img);
                const voice = customMoleVoices[index] || "smash.mp3"; // Use custom voice if available, otherwise default
                playAudio(voice);
            }
        });

        hole.innerHTML = ''; // Clear the hole before adding the new mole image
        hole.appendChild(img);

        const moleDuration = getRandomInterval(1500, 2000);
        const moleTimer = setTimeout(() => {
            hole.removeChild(img);
        }, moleDuration);
        moleTimers.push(moleTimer);
    });

    const nextMoleInterval = 2000;
    setTimeout(() => {
        run();
    }, nextMoleInterval);
}

function startGame() {
    startButton.disabled = true;
    document.body.classList.add('game-started');
    score = 0;
    scoreEl.textContent = score;
    moleTimers = [];

    let timeLeft = 30;
    countdownEl.textContent = timeLeft;
    const countdownInterval = setInterval(() => {
        timeLeft--;
        countdownEl.textContent = timeLeft;
        if (timeLeft === 0) {
            clearInterval(countdownInterval);
            endGame();
        }
    }, 1000);

    gameTimer = setTimeout(() => {
        endGame();
    }, 30000);

    run();
}

function endGame() {
    startButton.disabled = false;
    document.body.classList.remove('game-started');
    moleTimers.forEach(timer => clearTimeout(timer));
    gameTimer = null;
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

customizeButton.addEventListener('click', () => {
    openCustomizationInterface();
});

closeButton.addEventListener('click', () => {
    closeCustomizationInterface();
});

function openCustomizationInterface() {
    const customizationContainer = document.createElement('div');
    customizationContainer.classList.add('customization-container');

    const title = document.createElement('h2');
    title.textContent = 'Customize Moles';

    const moleImagesContainer = document.createElement('div');
    moleImagesContainer.classList.add('mole-images-container');

    customMoleImages.forEach((image, index) => {
        const moleContainer = document.createElement('div');
        moleContainer.classList.add('mole-container');

        const img = document.createElement('img');
        img.src = image;
        img.classList.add('mole-image');

        const button = document.createElement('button');
        button.textContent = 'Change Image';
        button.classList.add('change-image-button');
        button.addEventListener('click', () => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        customMoleImages[index] = e.target.result; // Save the custom image
                        img.src = e.target.result; // Update the image preview
                    };
                    reader.readAsDataURL(file);
                }
            });
            fileInput.click();
        });

        const voiceButton = document.createElement('button');
        voiceButton.textContent = customMoleVoices[index] ? 'Change Voice (Modified)' : 'Change Voice';
        voiceButton.classList.add('change-voice-button');
        voiceButton.addEventListener('click', () => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'audio/*';
            fileInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const audio = new Audio();
                        audio.src = e.target.result;
                        customMoleVoices[index] = e.target.result; // Save the custom voice
                        voiceButton.textContent = 'Change Voice (Modified)'; // Update button text
                    };
                    reader.readAsDataURL(file);
                }
            });
            fileInput.click();
        });

        moleContainer.appendChild(img);
        moleContainer.appendChild(button);
        moleContainer.appendChild(voiceButton);

        moleImagesContainer.appendChild(moleContainer);
    });

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.classList.add('close-button');
    closeButton.addEventListener('click', () => {
        closeCustomizationInterface();
    });

    customizationContainer.appendChild(title);
    customizationContainer.appendChild(moleImagesContainer);
    customizationContainer.appendChild(closeButton);

    document.body.appendChild(customizationContainer);
}

function closeCustomizationInterface() {
    const customizationContainer = document.querySelector('.customization-container');
    if (customizationContainer) {
        customizationContainer.remove();
    }
}

function getRandomDefaultMoleImage() {
    // Get default mole images that have not been replaced by custom images
    const defaultMoleImages = moleImages.filter((_, index) => !customMoleImages[index]);
    // Return a random default mole image
    return defaultMoleImages[Math.floor(Math.random() * defaultMoleImages.length)];
}

function playAudio(src) {
    // Stop the currently playing audio, if any
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    // Play the new audio
    currentAudio = new Audio(src);
    currentAudio.play();
}
