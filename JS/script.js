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
let xPlayerDropdown;
let oPlayerDropdown;
let startGameButton;
let selectedXPlayerId;
let selectedOPlayerId;


startGame();

restartButton.addEventListener('click', startGame);

startGameButton.addEventListener('click', async (event) => {
  event.preventDefault();
  selectedXPlayerId = xPlayerDropdown.value;
  selectedOPlayerId = oPlayerDropdown.value;
  startGame(selectedXPlayerId, selectedOPlayerId);
});

async function startGame(xPlayerId, oPlayerId) {
  xCount = 0;
  oCount = 0;
  xCountElement = document.getElementById('xCountElement');
  oCountElement = document.getElementById('oCountElement');
  xPlayerDropdown = document.getElementById('xPlayerDropdown');
  oPlayerDropdown = document.getElementById('oPlayerDropdown');
  startGameButton = document.getElementById('startGameButton');
  startGameButton.disabled = true;

  // Use the passed player IDs if provided, otherwise fetch new players
  if (xPlayerId && oPlayerId) {
    selectedXPlayerId = xPlayerId;
    selectedOPlayerId = oPlayerId;
  } else {
    await fetchPlayers();

    // Set the selected player IDs
    selectedXPlayerId = xPlayerDropdown.value;
    selectedOPlayerId = oPlayerDropdown.value;
  }

  // Log the selected player IDs for debugging
  console.log('Selected X Player ID:', selectedXPlayerId);
  console.log('Selected O Player ID:', selectedOPlayerId);

  // Set the dropdown values based on the selected IDs
  xPlayerDropdown.value = selectedXPlayerId;
  oPlayerDropdown.value = selectedOPlayerId;

  circleTurn = false;
  console.log('Circle Turn:', circleTurn);
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

async function fetchPlayers() {
  try {
    const response = await fetch('http://localhost:3000/users');
    const result = await response.json();

    if (result && Array.isArray(result.users)) {
      const users = result.users;

      xPlayerDropdown.innerHTML = '';
      oPlayerDropdown.innerHTML = '';

      addEmptyOption(xPlayerDropdown);
      addEmptyOption(oPlayerDropdown);

      users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.text = user.username;

        xPlayerDropdown.add(option.cloneNode(true));
        oPlayerDropdown.add(option);
      });

      xPlayerDropdown.addEventListener('change', () => {
        const selectedXPlayerId = xPlayerDropdown.value;
        const selectedOPlayerId = oPlayerDropdown.value;
        disableOptionInODropdown(selectedXPlayerId);
        disableOptionInXDropdown(selectedOPlayerId);
        checkStartGameButton();
      });

      oPlayerDropdown.addEventListener('change', () => {
        const selectedOPlayerId = oPlayerDropdown.value;
        const selectedXPlayerId = xPlayerDropdown.value;
        disableOptionInXDropdown(selectedOPlayerId);
        disableOptionInODropdown(selectedXPlayerId);
        checkStartGameButton();
      });
    } else {
      console.error('Invalid response format:', result);
    }
  } catch (error) {
    console.error('Error fetching players:', error);
  }
}

function addEmptyOption(dropdown) {
  const option = document.createElement('option');
  option.value = '';
  option.text = 'Select Player';
  dropdown.add(option);
}

function disableOptionInXDropdown(selectedOPlayerId) {
  Array.from(xPlayerDropdown.options).forEach(option => {
    option.disabled = false;
    if (option.value === selectedOPlayerId) {
      option.disabled = true;
    }
  });
}

function disableOptionInODropdown(selectedXPlayerId) {
  Array.from(oPlayerDropdown.options).forEach(option => {
    option.disabled = false;
    if (option.value === selectedXPlayerId) {
      option.disabled = true;
    }
  });
}

function checkStartGameButton() {
  startGameButton.disabled = !(xPlayerDropdown.value && oPlayerDropdown.value);
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
  console.log('Selected X Player ID:', selectedXPlayerId);
  console.log('Selected O Player ID:', selectedOPlayerId);
}

function endGame() {
  const winnerId = circleTurn ? selectedOPlayerId : selectedXPlayerId;
  const loserId = circleTurn ? selectedXPlayerId : selectedOPlayerId;

  // Get winner and loser names
  const winnerName = getPlayerName(winnerId);
  const loserName = getPlayerName(loserId);

  winningMessageTextElement.innerText = `${winnerName} Wins!`;
  winningMessageElement.classList.add('show');
  console.log(`${winnerName} Wins!`);

  // Update rating and match history
  updateRating(winnerName, 10); // Assuming you want to increase the winner's rating
  updateRating(loserName, -10); // Assuming you want to decrease the loser's rating
  updateMatchHistory(winnerName, loserName, rounds); // Replace 'rounds' with the actual number of rounds played
  console.log('Circle Turn After Game Ends:', circleTurn);

}

function getPlayerName(playerId) {
  const playerOption = Array.from(xPlayerDropdown.options).find(option => option.value === playerId);

  if (playerOption) {
    return playerOption.text;
  } else {
    console.error(`Player with ID ${playerId} not found in the dropdown options.`);
    return 'Unknown Player';
  }
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


async function updateRating(username, change) {
  try {
    console.log('Updating rating...');
    const response = await fetch('http://localhost:3000/updateRating', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, change }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result);
    } else {
      console.error('Failed to update rating. Server returned:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error updating rating:', error);
  }
}

async function updateMatchHistory(winner, loser, rounds) {
  try {
    console.log('Updating match history...');
    const response = await fetch('http://localhost:3000/updateMatchHistory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ winner, loser, rounds }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result);
    } else {
      console.error('Failed to update match history. Server returned:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error updating match history:', error);
  }
}