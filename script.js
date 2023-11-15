const X_CLASS = 'x'
const CIRCLE_CLASS = 'circle'
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]
const MAX_PIECES = 3
const cellElements = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
const winningMessageElement = document.getElementById('winningMessage')
const restartButton = document.getElementById('restartButton')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
let circleTurn

startGame()

restartButton.addEventListener('click', startGame)

function startGame() {
  circleTurn = false;
  cellElements.forEach(cell => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(CIRCLE_CLASS);
  });
  setBoardHoverClass();
  winningMessageElement.classList.remove('show');
  board.addEventListener('click', handleClick);
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;

  if (countPieces(currentClass) >= MAX_PIECES) {
    removeOldestPiece(currentClass);
  }

  if (cell.classList.contains('cell') && !cell.classList.contains(X_CLASS) && !cell.classList.contains(CIRCLE_CLASS)) {
    placeMark(cell, currentClass);

    if (checkWin(currentClass)) {
      endGame(false);
    } else {
      swapTurns();
      setBoardHoverClass();
    }
  }
}


function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = `Draw!`
  } else {
    winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!`
  }
  winningMessageElement.classList.add('show')
}

// function isdraw() {
//   return [...cellElements].every(cell => {
//     return cell.classList.contains(X_CLASS) ||
//       cell.classList.contains(CIRCLE_CLASS)
//   })
// }

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass)
}

function swapTurns() {
  circleTurn = !circleTurn
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS)
  board.classList.remove(CIRCLE_CLASS)
  if (circleTurn) {
    board.classList.add(CIRCLE_CLASS)
  } else {
    board.classList.add(X_CLASS)
  }
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cellElements[index].classList.contains(currentClass)
    })
  })
}

function countPieces(currentClass) {
  return [...cellElements].filter(cell => cell.classList.contains(currentClass)).length
}

function removeOldestPiece(currentClass) {
  const pieces = [...cellElements].filter(cell => cell.classList.contains(currentClass));
  if (pieces.length >= MAX_PIECES) {
    const cellToRemove = pieces[0];
    cellToRemove.classList.remove(currentClass);
    cellToRemove.removeEventListener('click', handleClick);
  }
}

