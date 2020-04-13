'use strict';
module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    quantity: DataTypes.INTEGER,
    orderId: DataTypes.INTEGER,
    ProductId: DataTypes.INTEGER
  }, {});
  OrderItem.associate = function(models) {
    // associations can be defined here
  };
  return OrderItem;
};