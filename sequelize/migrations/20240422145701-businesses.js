/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS postgis;');
    await queryInterface.createTable('businesses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(255),
      },
      latitude: {
        type: Sequelize.DECIMAL(9, 6),
      },
      longitude: {
        type: Sequelize.DECIMAL(9, 6),
      },
      type: {
        type: Sequelize.STRING(50),
      },
    });
  },
  async down(queryInterface, _) {
    await queryInterface.dropTable('businesses');
  },
};
