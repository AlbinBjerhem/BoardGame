const express = require('express');
const fs = require('fs/promises');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

app.use(express.json());

app.post('/register', async (req, res) => {
  const { username } = req.body;

  try {
    const userData = await fs.readFile('json/user.json', 'utf-8');
    const users = JSON.parse(userData);

    users.users.push({ username });

    await fs.writeFile('json/user.json', JSON.stringify(users, null, 2));

    res.status(200).send('User registered successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
