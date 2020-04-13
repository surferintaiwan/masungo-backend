'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category1 = sequelize.define('Category1', {
    name: DataTypes.STRING
  }, {});
  Category1.associate = function(models) {
    // associations can be defined here
  };
  return Category1;
};