const express = require('express');
const axios = require('axios');
const authenticateToken = require('../middleware/auth');

const { WikiEntry, UserContentWikiEntry, Movie, TVShow } = require('../models');


const router = express.Router();

async function fetchWikiSummaryIfCategoryMatches(title, categoryRegex) {
  const cleanTitle = title.replace(/\s*\(.*?\)\s*/g, '').trim();

  const searchRes = await axios.get(`https://en.wikipedia.org/w/api.php`, {
    params: {
      action: 'query',
      list: 'search',
      srsearch: cleanTitle,
      format: 'json',
      origin: '*',
    },
  });

  const searchResults = searchRes.data.query.search;
  if (searchResults.length === 0) {
    throw new Error('No Wikipedia article found');
  }

  for (const result of searchResults.slice(0, 10)) {
    const pageTitle = result.title;

    const categoriesRes = await axios.get(`https://en.wikipedia.org/w/api.php`, {
      params: {
        action: 'query',
        titles: pageTitle,
        prop: 'categories',
        format: 'json',
        origin: '*',
      },
    });

    const pages = categoriesRes.data.query.pages;
    const pageId = Object.keys(pages)[0];
    const categories = pages[pageId].categories || [];

    const matchesCategory = categories.some(cat => {
      const cleanCategory = cat.title.replace(/^Category:/i, '');
      return categoryRegex.test(cleanCategory);
    });

    if (matchesCategory) {
      const summaryRes = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`
      );

      return summaryRes.data;
    }
  }
  const fallbackTitle = searchResults[0].title;
  const summaryRes = await axios.get(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(fallbackTitle)}`
  );

  return {
    ...summaryRes.data,
    warning: 'No matching category found, using top result',
  };
}


//const tvCategoryRegex = /(television series|tv series|tv shows|serial|soap opera|drama series|comedy series|miniseries|sitcom|telenovela|anthology series|animated series|web series|reality television|documentary television|television program|tv miniseries)/i;
const tvCategoryRegex = /\b(tv series|television series|american television series|british television series|[a-z]+ drama television series|comedy television series|soap opera|sitcom|miniseries|telenovela|animated television series|children's television series|web television series|reality television series|documentary television series|television shows|television programs|tv miniseries)\b/i;

//const movieCategoryRegex = /(film|films|movie|movies|feature films|short films|documentary films|animated films|action films|adventure films|science fiction films|sci-fi films|drama films|comedy films|horror films|thriller films|fantasy films|romantic films|war films|crime films|biographical films|independent films|foreign films|silent films|black-and-white films|3d films|musical films|sports films|western films|experimental films|cult films|epic films|superhero films)/i;
const movieCategoryRegex = /\b(films|film|[a-z]+ films|[a-z]+ language films|feature films|short films|documentary films|animated films|action films|science fiction films|sci-fi films|drama films|comedy films|horror films|thriller films|fantasy films|romantic films|crime films|biographical films|independent films|foreign films|black-and-white films|3d films|musical films|sports films|western films|cult films|epic films|superhero films)\b/i;

async function findOrCreateWikiEntry(data) {
  const [entry] = await WikiEntry.findOrCreate({
    where: { title: data.title },
    defaults: {
      description: data.description || '',
      extract: data.extract,
      url: data.content_urls.desktop.page,
    },
  });
  return entry;
}

router.get('/wiki/movie/:title', authenticateToken, async (req, res) => {
  const rawTitle = req.params.title;
  console.log('GET /wiki/movie/:title called with:', rawTitle, 'User:', req.user);

  const tryTitles = [
    `${rawTitle} (film)`,
    `${rawTitle} (movie)`,
    rawTitle,
  ];

  for (const titleVariant of tryTitles) {
    try {
      const data = await fetchWikiSummaryIfCategoryMatches(titleVariant, movieCategoryRegex);
      const wikiEntry = await findOrCreateWikiEntry(data);

      const movie = await Movie.findOne({ where: { title: rawTitle } });
      await UserContentWikiEntry.findOrCreate({
        where: {
          userId: req.user.id,
          movieId: movie ? movie.id : null,
          wikiEntryId: wikiEntry.id,
        },
      });

      return res.json({
        title: data.title,
        description: data.description || '',
        extract: data.extract,
        url: data.content_urls.desktop.page,
        warning: data.warning || undefined,
      });

    } catch (err) {
      console.warn(`Próba pobrania "${titleVariant}" nie powiodła się:`, err.message);
    }
  }

  res.status(404).json({ error: 'No suitable movie article found' });
});


router.get('/wiki/tv/:title', authenticateToken, async (req, res) => {
  const rawTitle = req.params.title;
  console.log('GET /wiki/tv/:title called with:', rawTitle, 'User:', req.user);

  const tryTitles = [
    `${rawTitle} (TV series)`,
    rawTitle,
  ];

  for (const titleVariant of tryTitles) {
    try {
      const data = await fetchWikiSummaryIfCategoryMatches(titleVariant, tvCategoryRegex);
      const wikiEntry = await findOrCreateWikiEntry(data);

      const show = await TVShow.findOne({ where: { title: rawTitle } });
      await UserContentWikiEntry.findOrCreate({
        where: {
          userId: req.user.id,
          tvshowId: show ? show.id : null,
          wikiEntryId: wikiEntry.id,
        },
      });

      return res.json({
        title: data.title,
        description: data.description || '',
        extract: data.extract,
        url: data.content_urls.desktop.page,
        warning: data.warning || undefined,
      });

    } catch (err) {
      console.warn(`Próba pobrania "${titleVariant}" nie powiodła się:`, err.message);
    }
  }

  res.status(404).json({ error: 'No suitable TV show article found' });
});


module.exports = router;