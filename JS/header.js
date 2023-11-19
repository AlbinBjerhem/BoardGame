function navigateToRegistration() {
  loadRegistrationPage();
}

function navigateToGame() {
  loadGamePage();
}

function navigateToScores() {
  loadScoresPage();
}

document.getElementById('registrationButton').addEventListener('click', navigateToRegistration);
document.getElementById('gameButton').addEventListener('click', navigateToGame);
document.getElementById('scoresButton').addEventListener('click', navigateToScores);
