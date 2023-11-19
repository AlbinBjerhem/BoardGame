function loadRegistrationPage() {
  fetch('../HTML/UserRegistration.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('app').innerHTML = data;
    });
}

function loadGamePage() {
  fetch('../HTML/GamePage.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('app').innerHTML = data;
    });
}

function loadScoresPage() {
  fetch('../HTML/ScorePage.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('app').innerHTML = data;
    });
}


document.addEventListener('DOMContentLoaded', function () {
  loadRegistrationPage();
});