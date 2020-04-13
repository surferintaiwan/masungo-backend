'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // 依據之前新增的兩筆訂單，紀錄付款狀態，一筆付款成功，一筆付款失敗
    return queryInterface.bulkInsert('PaymentRecords', [
      {
        OrderId: 1,
        paymentStatus: true,
        payNumber: new Date(),
        amount: 2000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        OrderId: 2,
        paymentStatus: false,
        payNumber: new Date(),
        amount: 500,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('PaymentRecords', null, {})
  }
};
