/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, _) {
    const businessesData = require('../assets/businesses.json');
    const contentCount = await queryInterface.sequelize.query(
      'SELECT COUNT(id) FROM businesses',
    ).count;

    // Just to avoid to seed it every time the container starts
    // Accounts for 0 -> no records or undefined -> table not existing
    if (!contentCount) {
      console.log('businesses table is empty -> seeding');
      await queryInterface.bulkInsert(
        'businesses',
        Object.values(businessesData).map((rawBusiness) => ({
          name: rawBusiness['Basic Fields']['Chain Name'],
          latitude: Object.values(rawBusiness['Locations'])[0].Lat,
          longitude: Object.values(rawBusiness['Locations'])[0].Long,
          type: rawBusiness['Basic Fields'].Category,
        })),
      );
      return;
    }

    console.log('businesses table is not empty -> seeding stopped');
  },

  async down(queryInterface, _) {
    await queryInterface.bulkDelete('businesses', null, {});
  },
};
