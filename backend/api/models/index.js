const { Sequelize, DataTypes, Transaction } = require('sequelize');


const sequelize = new Sequelize(
  process.env.DB_NAME || 'media_app',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    define: { timestamps: true },
    logging: false
  }
);


const User = require('./User')(sequelize, DataTypes);
const Movie = require('./Movie')(sequelize, DataTypes);
const TVShow = require('./TVShow')(sequelize, DataTypes);
const WikiEntry = require('./WikiEntry')(sequelize, DataTypes);
const UserContentWikiEntry = require('./UserContentWikiEntry')(sequelize, DataTypes);

User.belongsToMany(WikiEntry, { through: UserContentWikiEntry, foreignKey: 'userId' });
WikiEntry.belongsToMany(User, { through: UserContentWikiEntry, foreignKey: 'wikiEntryId' });

User.hasMany(UserContentWikiEntry, { foreignKey: 'userId' });
Movie.hasMany(UserContentWikiEntry, { foreignKey: 'movieId' });
TVShow.hasMany(UserContentWikiEntry, { foreignKey: 'tvshowId' });
WikiEntry.hasMany(UserContentWikiEntry, { foreignKey: 'wikiEntryId' });

UserContentWikiEntry.belongsTo(User, { foreignKey: 'userId' });
UserContentWikiEntry.belongsTo(Movie, { foreignKey: 'movieId' });
UserContentWikiEntry.belongsTo(TVShow, { foreignKey: 'tvshowId' });
UserContentWikiEntry.belongsTo(WikiEntry, { foreignKey: 'wikiEntryId' });

module.exports = {
  sequelize,
  Sequelize,
  Transaction, 
  User,
  Movie,
  TVShow,
  WikiEntry,
  UserContentWikiEntry
};