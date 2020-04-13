'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    brand: DataTypes.INTEGER,
    listPrice: DataTypes.INTEGER,
    sellingPrice: DataTypes.INTEGER,
    inventory: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN,
    shippingFee: DataTypes.BOOLEAN,
    image1: DataTypes.STRING,
    image2: DataTypes.STRING,
    image3: DataTypes.STRING,
    image4: DataTypes.STRING,
    detail: DataTypes.TEXT,
    deliveryKnow: DataTypes.TEXT,
    refundKnow: DataTypes.TEXT,
    category1: DataTypes.INTEGER,
    category2: DataTypes.INTEGER,
    category3: DataTypes.INTEGER
  }, {});
  Product.associate = function(models) {
    // associations can be defined here
  };
  return Product;
};