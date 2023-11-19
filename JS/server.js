const express = require('express');
const fs = require('fs/promises');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const userDataPath = path.join(__dirname, '../json/users.json');

app.post('/register', async (req, res) => {
  const { username } = req.body;

  try {
    const userData = await fs.readFile(userDataPath, 'utf-8');
    const users = JSON.parse(userData);

    users.users.push({ username });

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
