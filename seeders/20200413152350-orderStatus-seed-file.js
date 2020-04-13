'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('OrderStatuses', [
      {
        name: '待付款',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '訂單處理中',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '訂單取消',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '出貨中',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '已出貨',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '已送達',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '退貨中',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: '已退貨',
        createdAt: new Date(),
        updatedAt: new Date()
      }

    ], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('OrderStatuses', null, {})
  }
};
