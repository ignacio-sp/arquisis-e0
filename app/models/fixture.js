'use strict';
const {
  Model
} = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class Fixture extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Fixture.init({
    referee: DataTypes.STRING,
    timezone: DataTypes.STRING,
    date: DataTypes.DATE,
    timestamp: DataTypes.INTEGER,
    status_long: DataTypes.STRING,
    status_short: DataTypes.STRING,
    status_elapsed: DataTypes.STRING,
    league_id: DataTypes.INTEGER,
    home_team_id: DataTypes.INTEGER,
    away_team_id: DataTypes.INTEGER,
    home_goals: DataTypes.INTEGER,
    away_goals: DataTypes.INTEGER,
    home_odds: DataTypes.FLOAT,
    away_odds: DataTypes.FLOAT,
    draw_odds: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Fixture',
  });

  return Fixture;
};