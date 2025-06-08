module.exports = (sequelize, DataTypes) => {
  return sequelize.define('WikiEntry', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    extract: DataTypes.TEXT,
    url: DataTypes.STRING
  });
};
