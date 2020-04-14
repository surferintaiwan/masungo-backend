'use strict';
module.exports = (sequelize, DataTypes) => {
  const PaymentRecord = sequelize.define('PaymentRecord', {
    OrderId: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    paymentStatus: DataTypes.STRING
  }, {});
  PaymentRecord.associate = function(models) {
    PaymentRecord.belongsTo(models.Order)
  };
  return PaymentRecord;
};