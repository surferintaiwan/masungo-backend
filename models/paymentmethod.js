'use strict';
module.exports = (sequelize, DataTypes) => {
  const PaymentMethod = sequelize.define('PaymentMethod', {
    name: DataTypes.STRING
  }, {});
  PaymentMethod.associate = function(models) {
    // associations can be defined here
  };
  return PaymentMethod;
};