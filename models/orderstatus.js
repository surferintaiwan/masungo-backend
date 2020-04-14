'use strict';
module.exports = (sequelize, DataTypes) => {
  const OrderStatus = sequelize.define('OrderStatus', {
    name: DataTypes.STRING
  }, {});
  OrderStatus.associate = function(models) {
    OrderStatus.hasMany(models.Order)
  };
  return OrderStatus;
};