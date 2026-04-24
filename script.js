const gameBoard = document.getElementById('game-board');
const movesDisplay = document.getElementById('moves');
const timeDisplay = document.getElementById('time');
const restartBtn = document.getElementById('restart-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const victoryScreen = document.getElementById('victory-screen');
const finalTimeDisplay = document.getElementById('final-time');
const finalMovesDisplay = document.getElementById('final-moves');

// Cyberpunk/Tech emojis for the cards
const cardIcons = ['🤖', '👾', '🚀', '💻', '🔋', '📡', '🕹️', '🧬'];
let cards = [];
let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let moves = 0;
let matchedPairs = 0;

// Timer variables
let timeElapsed = 0;
let timerInterval;
let timerStarted = false;

function initGame() {
    // Reset variables
    gameBoard.innerHTML = '';
    moves = 0;
    matchedPairs = 0;
    movesDisplay.textContent = moves;
    hasFlippedCard = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;
    victoryScreen.classList.add('hidden');
    
    resetTimer();

    // Create and shuffle deck (pairs of icons)
    const deck = [...cardIcons, ...cardIcons];
    deck.sort(() => Math.random() - 0.5);

    // Generate card elements
    deck.forEach(icon => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.icon = icon;

        cardElement.innerHTML = `
            <div class="card-face card-front"></div>
            <div class="card-face card-back">
                <span class="card-icon" style="color: ${getRandomNeonColor()}">${icon}</span>
            </div>
        `;

        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
}

function getRandomNeonColor() {
    const colors = ['#00f3ff', '#ff00ff', '#00ff66', '#ffea00'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function startTimer() {
    if (timerStarted) return;
    timerStarted = true;
    timerInterval = setInterval(() => {
        timeElapsed++;
        updateTimeDisplay();
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerStarted = false;
}

function resetTimer() {
    stopTimer();
    timeElapsed = 0;
    updateTimeDisplay();
}

function updateTimeDisplay() {
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    startTimer();

    this.classList.add('flipped');

    if (!hasFlippedCard) {
        // First click
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // Second click
    secondCard = this;
    moves++;
    movesDisplay.textContent = moves;
    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.icon === secondCard.dataset.icon;

    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');

    resetBoard();
    matchedPairs++;

    if (matchedPairs === cardIcons.length) {
        setTimeout(gameWon, 500);
    }
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function gameWon() {
    stopTimer();
    finalTimeDisplay.textContent = timeDisplay.textContent;
    finalMovesDisplay.textContent = moves;
    victoryScreen.classList.remove('hidden');
    
    // Add some glitch/sparkle effects here if desired
}

// Event Listeners
restartBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);

// Initialize game on load
initGame();
