const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
const MAX_PIECES = 3;
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningMessageElement = document.getElementById('winningMessage');
const restartButton = document.getElementById('restartButton');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
let circleTurn;
let placedPieces = [];
let xCount = 0;
let oCount = 0;
let xCountElement;
let oCountElement;

startGame();

restartButton.addEventListener('click', startGame);

function startGame() {
  xCount = 0;
  oCount = 0;
  xCountElement = document.getElementById('xCountElement');
  oCountElement = document.getElementById('oCountElement');
  updateCount();

  circleTurn = false;
  placedPieces = [];
  cellElements.forEach(cell => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(CIRCLE_CLASS);
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick);
  });
  setBoardHoverClass();
  winningMessageElement.classList.remove('show');
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;

  if (countPieces(currentClass) >= MAX_PIECES) {
    removeOldestPiece(currentClass);
  }

  if (!cell.classList.contains(X_CLASS) && !cell.classList.contains(CIRCLE_CLASS)) {
    placeMark(cell, currentClass);
    placedPieces.push(cell);

    if (checkWin(currentClass)) {
      endGame(false);
    } else {
      updateCount(currentClass);
      swapTurns();
      setBoardHoverClass();
    }
  }
}

function endGame() {
  winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!`;
  winningMessageElement.classList.add('show');
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function swapTurns() {
  circleTurn = !circleTurn;
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(CIRCLE_CLASS);
  if (circleTurn) {
    board.classList.add(CIRCLE_CLASS);
  } else {
    board.classList.add(X_CLASS);
  }
}

function checkWin(currentClass) {
  if (WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cellElements[index].classList.contains(currentClass);
    });
  })) {
    updateCount(currentClass);
    return true;
  }
  return false;
}


function countPieces(currentClass) {
  return [...cellElements].filter(cell => cell.classList.contains(currentClass)).length;
}

function removeOldestPiece(currentClass) {
  if (placedPieces.length >= MAX_PIECES) {
    const cellToRemove = placedPieces.shift();
    cellToRemove.classList.remove(currentClass);
  }
}

function updateCount(currentClass) {
  if (currentClass === X_CLASS) {
    xCount++;
    xCountElement.innerText = `X Count: ${xCount}`;
  } else if (currentClass === CIRCLE_CLASS) {
    oCount++;
    oCountElement.innerText = `O Count: ${oCount}`;
  }
}
