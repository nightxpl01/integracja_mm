module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Movie', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: DataTypes.STRING,
    summary: DataTypes.TEXT,
    rating: DataTypes.STRING,
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