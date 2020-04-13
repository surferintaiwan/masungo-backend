'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('PaymentMethods', [
      {
        name: '信用卡',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'ATM轉帳',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'LINE PAY',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('PaymentMethods', null, {})
  }
};
