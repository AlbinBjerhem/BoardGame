const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const userDataPath = path.join(__dirname, '../json/users.json');

app.get('/users', async (req, res) => {
  try {
    const userData = await fs.readFile(userDataPath, 'utf-8');
    const users = JSON.parse(userData);
    res.json({ users: users.users });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/users/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const userData = await fs.readFile(userDataPath, 'utf-8');
    const users = JSON.parse(userData);

    const user = users.users.find(user => user.username === username);

    if (user) {
      res.json({
        id: user.id,
        username: user.username,
        rating: user.rating,
        matchHistory: user.matchHistory,
      });
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/register', async (req, res) => {
  const { username } = req.body;

  try {
    const cleanedUsername = username.replace(/\s/g, '').toUpperCase();

    const userData = await fs.readFile(userDataPath, 'utf-8');

    const users = JSON.parse(userData);

    const existingUser = users.users.find(user => user.username === cleanedUsername);
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    const newUser = {
      id: users.users.length + 1,
      username: cleanedUsername,
      rating: 1000,
      matchHistory: []
    };

    users.users.push(newUser);

    await fs.writeFile(userDataPath, JSON.stringify(users, null, 2));

    res.status(200).send('User registered successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.post('/updateRating', async (req, res) => {
  const { username, change } = req.body;

  try {
    console.log('Update Rating endpoint reached');
    const userData = await fs.readFile(userDataPath, 'utf-8');
    const users = JSON.parse(userData);

    const userIndex = users.users.findIndex(user => user.username === username);

    if (userIndex !== -1) {
      console.log(`Updating rating for ${username}`);
      users.users[userIndex].rating += change;
      await fs.writeFile(userDataPath, JSON.stringify(users, null, 2));
      console.log('Rating updated successfully');
      res.json({ success: true, message: 'Rating updated successfully' });
    } else {
      console.log(`User not found: ${username}`);
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating rating:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/updateMatchHistory', async (req, res) => {
  const { winner, loser, rounds } = req.body;

  try {
    console.log('Update Match History endpoint reached');
    const userData = await fs.readFile(userDataPath, 'utf-8');
    const users = JSON.parse(userData);

    const winnerIndex = users.users.findIndex(user => user.username === winner);
    const loserIndex = users.users.findIndex(user => user.username === loser);

    if (winnerIndex !== -1 && loserIndex !== -1) {
      console.log(`Updating match history for ${winner} and ${loser}`);
      const matchResult = { winner, loser, rounds };
      users.users[winnerIndex].matchHistory.push(matchResult);
      users.users[loserIndex].matchHistory.push(matchResult);

      await fs.writeFile(userDataPath, JSON.stringify(users, null, 2));
      console.log('Match history updated successfully');
      res.json({ success: true, message: 'Match history updated successfully' });
    } else {
      console.log(`User not found. Winner: ${winner}, Loser: ${loser}`);
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating match history:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

