'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    userId: DataTypes.INTEGER,
    deliveryMethodId: DataTypes.INTEGER,
    paymentMethodId: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    orderStatus: DataTypes.INTEGER,
    paynumber: DataTypes.STRING
  }, {});
  Order.associate = function(models) {
    // associations can be defined here
  };
  return Order;
};