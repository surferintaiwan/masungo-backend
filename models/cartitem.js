"use strict"
module.exports = (sequelize, DataTypes) => {
    const CartItem = sequelize.define(
        "CartItem",
        {
            CartId: DataTypes.INTEGER,
            ProductId: DataTypes.INTEGER,
            quantity: DataTypes.INTEGER,
        },
        {}
    )
    CartItem.associate = function (models) {
        // associations can be defined here
        CartItem.belongsTo(models.Cart)
        CartItem.belongsTo(models.Product)
    }
    return CartItem
}
