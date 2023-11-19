function includeHeader() {
  fetch('../HTML/Header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-container').innerHTML = data;
    })
}

includeHeader()