function registerUser() {
  const username = document.getElementById('username').value;

  saveUserToServer(username);
}

async function saveUserToServer(username) {
  try {
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });

    if (response.ok) {
      console.log('User registered successfully');
    } else {
      const errorData = await response.json();
      console.error(`Failed to register user: ${errorData.error}`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
