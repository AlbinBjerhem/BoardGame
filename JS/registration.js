document.addEventListener('DOMContentLoaded', function () {
  fetchUsers();
});

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

      fetchUsers();

      document.getElementById('username').value = '';
    } else {
      const errorData = await response.json();
      console.error(`Failed to register user: ${errorData.error}`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function fetchUsers() {
  try {
    const response = await fetch('http://localhost:3000/users');
    const result = await response.json();

    if (result && Array.isArray(result.users)) {
      const users = result.users;

      const userDropdown = document.getElementById('userDropdown');
      userDropdown.innerHTML = '';
      users.forEach(user => {
        const option = document.createElement('option');
        option.text = user.username;
        userDropdown.add(option);
      });
    } else {
      console.error('Invalid response format:', result);
    }

  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

async function loadSelectedUser() {
  const userDropdown = document.getElementById('userDropdown');
  const selectedUsername = userDropdown.value;

  try {
    const response = await fetch(`http://localhost:3000/users/${selectedUsername}`);
    const userData = await response.json();

    document.getElementById('userDetails').innerText = `
      Username: ${userData.username}
      Rating: ${userData.rating}
      Match History: ${userData.matchHistory.join(', ')}
    `;
  } catch (error) {
    console.error('Error fetching user details:', error);
  }
}
