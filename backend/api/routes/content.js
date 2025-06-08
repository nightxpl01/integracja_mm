const express = require('express');
const { Movie, TVShow } = require('../models/');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.get('/movies', authenticateToken, async (req, res) => {
  try {
    const movies = await Movie.findAll();
    console.log('Movies from DB:', movies);
    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

router.get('/tvshows', authenticateToken, async (req, res) => {
  const shows = await TVShow.findAll();
  res.json(shows);
});

module.exports = router;
