// // Function to load registration page
// function loadRegistrationPage() {
//   fetch('../HTML/UserRegistration.html')
//     .then(response => response.text())
//     .then(data => {
//       document.documentElement.innerHTML = data;
//     });
// }

// // Function to load game page
// function loadGamePage() {
//   fetch('../HTML/GamePage.html')
//     .then(response => response.text())
//     .then(data => {
//       document.documentElement.innerHTML = data;
//     });
// }

// // Function to load scores page
// function loadScoresPage() {
//   fetch('../HTML/ScorePage.html')
//     .then(response => response.text())
//     .then(data => {
//       document.documentElement.innerHTML = data;
//     });
// }

// // Add event listeners after the DOM has fully loaded
// document.addEventListener('DOMContentLoaded', function () {
//   document.getElementById('registrationButton').addEventListener('click', loadRegistrationPage);
//   document.getElementById('gameButton').addEventListener('click', loadGamePage);
//   document.getElementById('scoresButton').addEventListener('click', loadScoresPage);
// });
