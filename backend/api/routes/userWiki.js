const express = require('express');
const authenticateToken = require('../middleware/auth');
const { WikiEntry, UserContentWikiEntry, Movie, TVShow } = require('../models');


const router = express.Router();

router.get('/user/wiki', authenticateToken, async (req, res) => {
    try {
        const entries = await UserContentWikiEntry.findAll({
            where: { userId: req.user.id },
            include: [WikiEntry, Movie, TVShow]
        });

        res.json(entries);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user wiki entries' });
    }
});

router.post('/user/wiki', authenticateToken, async (req, res) => {
    let { title, description, extract, url, movieId, tvshowId } = req.body;

    if (movieId) {
        tvshowId = null;
    } else if (tvshowId) {
        movieId = null;
    }

    try {
        const [wikiEntry] = await WikiEntry.findOrCreate({
            where: { title, url },
            defaults: { description, extract }
        });

        const movieIdVal = movieId === undefined ? null : movieId;
        const tvshowIdVal = tvshowId === undefined ? null : tvshowId;

        const existing = await UserContentWikiEntry.findOne({
            where: {
                userId: req.user.id,
                wikiEntryId: wikiEntry.id,
                movieId: movieIdVal,
                tvshowId: tvshowIdVal
            }
        });

        if (existing) {
            return res.status(409).json({ error: 'Wpis już istnieje' });
        }

        await UserContentWikiEntry.create({
            userId: req.user.id,
            wikiEntryId: wikiEntry.id,
            movieId: movieId || null,
            tvshowId: tvshowId || null
        });

        res.status(201).json({ message: 'Wiki entry saved for user' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save wiki entry' });
    }
});



module.exports = router;