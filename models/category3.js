'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category3 = sequelize.define('Category3', {
    name: DataTypes.STRING,
    CategoryId2: DataTypes.INTEGER
  }, {});
  Category3.associate = function(models) {
    // associations can be defined here
  };
  return Category3;
};