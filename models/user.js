'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    gender: DataTypes.INTEGER,
    birthday: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Order)
    // associations can be defined here
  };
  return User;
};