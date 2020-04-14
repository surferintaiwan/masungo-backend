'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category1 = sequelize.define('Category1', {
    name: DataTypes.STRING
  }, {});
  Category1.associate = function(models) {
    Category1.hasMany(models.Product)
    Category1.hasMany(models.Category2)
  };
  return Category1;
};