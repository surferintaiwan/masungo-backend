'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      BrandId: {
        type: Sequelize.INTEGER
      },
      listPrice: {
        type: Sequelize.INTEGER
      },
      sellingPrice: {
        type: Sequelize.INTEGER
      },
      inventory: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.BOOLEAN
      },
      shippingFee: {
        type: Sequelize.BOOLEAN
      },
      image1: {
        type: Sequelize.STRING
      },
      image2: {
        type: Sequelize.STRING
      },
      image3: {
        type: Sequelize.STRING
      },
      image4: {
        type: Sequelize.STRING
      },
      detail: {
        type: Sequelize.TEXT
      },
      deliveryKnow: {
        type: Sequelize.TEXT
      },
      refundKnow: {
        type: Sequelize.TEXT
      },
      Category1Id: {
        type: Sequelize.INTEGER
      },
      Category2Id: {
        type: Sequelize.INTEGER
      },
      Category3Id: {
        type: Sequelize.INTEGER
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Products');
  }
};