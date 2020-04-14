'use strict';
module.exports = (sequelize, DataTypes) => {
  const DeliveryMethod = sequelize.define('DeliveryMethod', {
    name: DataTypes.STRING,
    fee: DataTypes.INTEGER
  }, {});
  DeliveryMethod.associate = function(models) {
    DeliveryMethod.hasMany(models.Order)
  };
  return DeliveryMethod;
};