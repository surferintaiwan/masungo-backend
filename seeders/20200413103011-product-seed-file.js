'use strict';

const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Products', 
    Array.from({length:50}).map(d=> {
      const listPrice = faker.commerce.price()
      return {
        name: faker.commerce.productName(),
        BrandId: Math.floor(Math.random() * 5) + 1,
        listPrice: listPrice,
        sellingPrice: listPrice - 10,
        inventory: faker.random.number(),
        sellingStatus: faker.random.boolean(),
        shippingFee: faker.random.boolean(),
        image1: faker.image.imageUrl(),
        image2: faker.image.imageUrl(),
        image3: faker.image.imageUrl(),
        image4: faker.image.imageUrl(),
        detail: faker.lorem.sentences(),
        deliveryKnow: faker.lorem.sentences(),
        refundKnow: faker.lorem.sentences(),
        Category1Id: Math.floor(Math.random() * 2) + 1,
        Category2Id: Math.floor(Math.random() * 4) + 1,
        Category3Id: Math.floor(Math.random() * 6) + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }), {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Products', null, {})
  }
};
