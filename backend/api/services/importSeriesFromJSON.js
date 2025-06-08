const fs = require('fs');
const path = require('path');
const { TVShow, sequelize, Transaction } = require('../models');

async function importSeriesFromJSON(filePath) {
  try {
    const absolutePath = path.resolve(filePath);
    const jsonData = fs.readFileSync(absolutePath, 'utf-8');
    const seriesArray = JSON.parse(jsonData);

    await sequelize.transaction(
      { isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED },
      async (t) => {
        for (const series of seriesArray) {
          // Walidacje i konwersje wartości
          const metascore = Number(series.metascore);
          const validMetascore = Number.isInteger(metascore) ? metascore : null;

          const releaseDate = new Date(series.release_date);
          const validDate = isNaN(releaseDate) ? null : releaseDate;

          const sortNo = Number(series.sort_no);
          const validSortNo = Number.isInteger(sortNo) ? sortNo : null;

          const userScore = Number(series.user_score);
          const validUserScore = Number.isFinite(userScore) ? userScore : null;

          await TVShow.create({
            id: series.id ? Number(series.id) : undefined,
            metascore: validMetascore,
            release_date: validDate,
            sort_no: validSortNo,
            summary: series.summary || '',
            title: series.title || 'Brak tytułu',
            user_score: validUserScore,
          }, { transaction: t });
        }
      }
    );

    console.log('Series imported from JSON.');
  } catch (error) {
    console.error('Error importing series from JSON:', error.message);
  }
}

module.exports = importSeriesFromJSON;
