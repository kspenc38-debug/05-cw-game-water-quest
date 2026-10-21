const GOAL_CANS = 20;
const ROUND_LENGTH = 30;
const MILESTONES = [5, 10, 15];

let currentCans = 0;
let timeLeft = ROUND_LENGTH;
let gameActive = false;
let spawnInterval = null;
let timerInterval = null;

const grid = document.querySelector('.game-grid');
const scoreDisplay = document.getElementById('current-cans');
const timerDisplay = document.getElementById('timer');
const messageDisplay = document.getElementById('achievements');
const startButton = document.getElementById('start-game');

function createGrid() {
  grid.innerHTML = '';

  for (let index = 0; index < 9; index++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    grid.appendChild(cell);
  }
}

function spawnWaterCan() {
  if (!gameActive) return;

  const cells = grid.querySelectorAll('.grid-cell');
  cells.forEach(cell => (cell.innerHTML = ''));

  const randomCell = cells[Math.floor(Math.random() * cells.length)];
  randomCell.innerHTML = `
    <div class="water-can-wrapper">
      <div class="water-can"></div>
    </div>
  `;
}

function updateScore() {
  scoreDisplay.textContent = currentCans;

  if (currentCans >= GOAL_CANS) {
    messageDisplay.textContent = 'Goal reached! You collected 20 cans!';
    endGame();
    return;
  }

  if (MILESTONES.includes(currentCans)) {
    messageDisplay.textContent = `${currentCans} cans collected. Keep going!`;
  } else {
    messageDisplay.textContent = 'Nice catch!';
  }
}

function startGame() {
  if (gameActive) return;

  currentCans = 0;
  timeLeft = ROUND_LENGTH;
  gameActive = true;
  scoreDisplay.textContent = currentCans;
  timerDisplay.textContent = timeLeft;
  messageDisplay.textContent = 'Tap the cans!';
  startButton.textContent = 'Playing...';
  createGrid();
  spawnWaterCan();

  spawnInterval = setInterval(spawnWaterCan, 1000);
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      messageDisplay.textContent = `Time is up! You collected ${currentCans} cans.`;
      endGame();
    }
  }, 1000);
}

function endGame() {
  gameActive = false;
  clearInterval(spawnInterval);
  clearInterval(timerInterval);
  spawnInterval = null;
  timerInterval = null;
  grid.querySelectorAll('.grid-cell').forEach(cell => (cell.innerHTML = ''));
  startButton.textContent = 'Play Again';
}

grid.addEventListener('click', event => {
  const clickedCan = event.target.closest('.water-can');
  if (!gameActive || !clickedCan) return;

  currentCans++;
  clickedCan.closest('.grid-cell').innerHTML = '';
  updateScore();

  if (gameActive) spawnWaterCan();
});

startButton.addEventListener('click', startGame);
createGrid();
