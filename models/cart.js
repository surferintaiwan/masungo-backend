"use strict"
module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define("Cart", {}, {})
    Cart.associate = function (models) {
        Cart.hasMany(models.CartItem) // associations can be defined here
    }
    return Cart
}
