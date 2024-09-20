'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Fixtures', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      referee: {
        type: Sequelize.STRING
      },
      timezone: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.DATE
      },
      status_long: {
        type: Sequelize.STRING
      },
      status_short: {
        type: Sequelize.STRING
      },
      status_elapsed: {
        type: Sequelize.STRING
      },
      league_id: {
        type: Sequelize.INTEGER
      },
      home_team_id: {
        type: Sequelize.INTEGER
      },
      away_team_id: {
        type: Sequelize.INTEGER
      },
      home_goals: {
        type: Sequelize.INTEGER
      },
      away_goals: {
        type: Sequelize.INTEGER
      },
      home_odds: {
        type: Sequelize.FLOAT
      },
      away_odds: {
        type: Sequelize.FLOAT
      },
      draw_odds: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Fixtures');
  }
};