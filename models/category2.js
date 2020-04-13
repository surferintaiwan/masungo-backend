'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category2 = sequelize.define('Category2', {
    name: DataTypes.STRING,
    CategoryId1: DataTypes.INTEGER
  }, {});
  Category2.associate = function(models) {
    // associations can be defined here
  };
  return Category2;
};