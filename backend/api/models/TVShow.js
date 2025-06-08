module.exports = (sequelize, DataTypes) => {
  return sequelize.define('TVShow', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: DataTypes.STRING,
    summary: DataTypes.TEXT,
    metascore: DataTypes.INTEGER,
    user_score: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    release_date: DataTypes.DATE,
    sort_no: DataTypes.INTEGER
  }, {
    timestamps: true
  });
};
