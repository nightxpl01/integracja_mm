const express = require('express');
const router = express.Router();
const { UserContentWikiEntry, Movie, TVShow, WikiEntry } = require('../models');

router.get('/user-media/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const entries = await UserContentWikiEntry.findAll({
      where: { userId },
      include: [
        { model: Movie, required: false },
        { model: TVShow, required: false },
        { model: WikiEntry, required: false }
      ]
    });

    const exportData = entries.map(entry => ({
      userId: entry.userId,
      movie: entry.Movie ? {
        id: entry.Movie.id,
        title: entry.Movie.title,
        metascore: entry.Movie.metascore,
        rating: entry.Movie.rating,
        release_date: entry.Movie.release_date,
        sort_no: entry.Movie.sort_no,
        summary: entry.Movie.summary,
        user_score: entry.Movie.user_score
      } : null,
      tvshow: entry.TVShow ? {
        id: entry.TVShow.id,
        title: entry.TVShow.title,
        metascore: entry.TVShow.metascore,
        release_date: entry.TVShow.release_date,
        sort_no: entry.TVShow.sort_no,
        summary: entry.TVShow.summary,
        user_score: entry.TVShow.user_score
      } : null,
      wikiEntry: entry.WikiEntry ? {
        id: entry.WikiEntry.id,
        title: entry.WikiEntry.title,
        description: entry.WikiEntry.description,
        extract: entry.WikiEntry.extract,
        url: entry.WikiEntry.url
      } : null
    }));

    res.json(exportData);
  } catch (error) {
    console.error('Error fetching user media:', error);
    res.status(500).json({ message: 'Failed to fetch user media.', error: error.message });
  }
});

module.exports = router;
