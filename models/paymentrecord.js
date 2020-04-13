'use strict';
module.exports = (sequelize, DataTypes) => {
  const PaymentRecord = sequelize.define('PaymentRecord', {
    OrderId: DataTypes.INTEGER,
    PaymentMethodId: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    paymentStatus: DataTypes.STRING
  }, {});
  PaymentRecord.associate = function(models) {
    // associations can be defined here
  };
  return PaymentRecord;
};