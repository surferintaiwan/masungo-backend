'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    userId: DataTypes.INTEGER,
    deliveryMethodId: DataTypes.INTEGER,
    paymentMethodId: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    orderStatusId: DataTypes.INTEGER,
  }, {});
  Order.associate = function(models) {
    Order.belongsTo(models.User)
    Order.belongsTo(models.DeliveryMethod)
    Order.belongsTo(models.PaymentMethod)
    Order.belongsTo(models.OrderStatus)
    Order.hasMany(models.OrderItem)
    Order.hasMany(models.PaymentRecord)
  };
  return Order;
};