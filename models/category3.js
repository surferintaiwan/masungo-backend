'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category3 = sequelize.define('Category3', {
    name: DataTypes.STRING,
    Category2Id: DataTypes.INTEGER
  }, {});
  Category3.associate = function(models) {
    Category3.hasMany(models.Product)
    Category3.belongsTo(models.Category2)
  };
  return Category3;
};