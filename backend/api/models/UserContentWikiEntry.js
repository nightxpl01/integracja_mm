module.exports = (sequelize, DataTypes) => {
  return sequelize.define('UserContentWikiEntry', {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    movieId: { type: DataTypes.INTEGER, allowNull: true },
    tvshowId: { type: DataTypes.INTEGER, allowNull: true },
    wikiEntryId: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    tableName: 'usercontentwikientries',
    timestamps: true
  });
};
