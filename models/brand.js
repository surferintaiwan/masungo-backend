'use strict';
module.exports = (sequelize, DataTypes) => {
  const Brand = sequelize.define('Brand', {
    name: DataTypes.STRING
  }, {});
  Brand.associate = function(models) {
    // associations can be defined here
    Brand.hasMany(models.Product)
  };
  return Brand;
};