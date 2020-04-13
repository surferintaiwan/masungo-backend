'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('DeliveryMethods', [
      {
        name: '超商取貨',
        fee: 60,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '宅配',
        fee: 120,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('DeliveryMethods', null, {})
  }
};
