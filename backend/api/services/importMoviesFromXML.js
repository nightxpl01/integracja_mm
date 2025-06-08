const fs = require('fs');
const { parseStringPromise } = require('xml2js');
const { Movie, sequelize, Transaction } = require('../models');

async function importMoviesFromXML(filePath) {
  const xmlData = fs.readFileSync(filePath, 'utf-8');
  const parsed = await parseStringPromise(xmlData, { explicitArray: false });

  let movies = parsed.movies?.movie;
  if (!movies) {
    console.error('Brak filmów w pliku XML');
    return;
  }
  if (!Array.isArray(movies)) {
    movies = [movies];
  }

  await sequelize.transaction(
    { isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE },
    async (t) => {
      for (const movie of movies) {
        let summary = '';
        if (typeof movie.summary === 'string') {
          summary = movie.summary;
        } else if (typeof movie.summary === 'object' && movie.summary !== null) {
          summary = '';
        }

        const releaseDate = new Date(movie.release_date);
        const validDate = isNaN(releaseDate) ? null : releaseDate;

        const userScore = Number(movie.user_score);
        const validUserScore = Number.isFinite(userScore) ? userScore : null;

        await Movie.create({
          id: movie.id ? Number(movie.id) : undefined,
          metascore: movie.metascore ? Number(movie.metascore) : null,
          rating: movie.rating || null,
          release_date: validDate,
          sort_no: movie.sort_no ? Number(movie.sort_no) : null,
          summary,
          title: movie.title || 'Brak tytułu',
          user_score: validUserScore,
        }, { transaction: t });
      }
    }
  );

  console.log('Movies imported from XML.');
}

module.exports = importMoviesFromXML;
