'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Brands',[
      {
        name: 'Nike',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Puma',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Acer',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Asus',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'MSI',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],{})
      
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Brands', null, {})
  }
};
