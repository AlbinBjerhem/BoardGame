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
