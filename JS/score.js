document.addEventListener('DOMContentLoaded', () => {
  const topUsersTableBody = document.getElementById('topUsersTableBody');

  fetchTopUsers().then(users => {
    populateTopUsersTable(users);
  });

  async function fetchTopUsers() {
    try {
      const response = await fetch('http://localhost:3000/topUsers');
      const result = await response.json();

      if (result && Array.isArray(result.users)) {
        return result.users;
      } else {
        console.error('Invalid response format:', result);
        return [];
      }
    } catch (error) {
      console.error('Error fetching top users:', error);
      return [];
    }
  }

  function populateTopUsersTable(users) {
    topUsersTableBody.innerHTML = '';

    users.slice(0, 5).forEach((user, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${user.username}</td>
        <td>${user.rating}</td>
      `;
      topUsersTableBody.appendChild(row);
    });
  }
});
