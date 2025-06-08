const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models');
require('dotenv').config();

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const user = await User.create({ username, password });
    res.json({ message: 'User created', user: { username: user.username } });
  } catch (err) {
    console.error('Registration error:', err);

    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'User already exists' });
    }

    res.status(500).json({ error: 'Server error during registration' });
  }
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET);

  res.json({ token });
});

module.exports = router;
