'use strict';

const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    // 總共新增30筆產品資料，分3次10筆新增
    // 10筆: 居家> 水杯/水瓶/水壺> 保冰/溫杯瓶
    // 10筆: 居家> 水杯/水瓶/水壺> 馬克杯/水杯
    // 10筆: 家電> 清潔家電> 圓筒吸塵器
    queryInterface.bulkInsert('Products', 
    Array.from({length:10}).map(d=> {
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
        Category1Id: 1,
        Category2Id: 1,
        Category3Id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }), {})
    queryInterface.bulkInsert('Products', 
    Array.from({length:10}).map(d=> {
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
        Category1Id: 1,
        Category2Id: 1,
        Category3Id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }), {})
    return queryInterface.bulkInsert('Products', 
    Array.from({length:10}).map(d=> {
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
        Category1Id: 1,
        Category2Id: 2,
        Category3Id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }), {})

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Products', null, {})
  }
};
