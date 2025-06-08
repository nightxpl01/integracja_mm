const fs = require('fs');
const path = require('path');
const { Builder } = require('xml2js');
const { UserContentWikiEntry, Movie, TVShow, WikiEntry, sequelize, Sequelize, Transaction } = require('../models');

async function exportUserMedia(userId, format = 'json') {
  return await sequelize.transaction(
    { isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ },
    async (t) => {
      const entries = await UserContentWikiEntry.findAll({
        where: { userId },
        include: [
          { model: Movie, required: false },
          { model: TVShow, required: false },
          { model: WikiEntry, required: false }
        ],
        transaction: t  // <-- tutaj przekazujesz transakcję
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

      const dir = path.resolve(__dirname, '../exports');
      const filePath = path.join(dir, `user_${userId}_media.${format}`);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (format === 'json') {
        fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2));
      } else if (format === 'xml') {
        const builder = new Builder();
        const xml = builder.buildObject({ entries: { entry: exportData } });
        fs.writeFileSync(filePath, xml);
      } else {
        throw new Error('Unsupported format: use json or xml.');
      }

      return filePath;
    }
  );
}

module.exports = exportUserMedia;
