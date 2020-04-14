'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category2 = sequelize.define('Category2', {
    name: DataTypes.STRING,
    Category1Id: DataTypes.INTEGER
  }, {});
  Category2.associate = function(models) {
    Category2.hasMany(models.Product)
    Category2.belongsTo(models.Category1)
    Category2.hasMany(models.Category3)
  };
  return Category2;
};