"use strict"
module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define(
        "Product",
        {
            name: DataTypes.STRING,
            BrandId: DataTypes.INTEGER,
            listPrice: DataTypes.INTEGER,
            sellingPrice: DataTypes.INTEGER,
            inventory: DataTypes.INTEGER,
            sellingStatus: DataTypes.BOOLEAN,
            shippingFee: DataTypes.BOOLEAN,
            image1: DataTypes.STRING,
            image2: DataTypes.STRING,
            image3: DataTypes.STRING,
            image4: DataTypes.STRING,
            detail: DataTypes.TEXT,
            deliveryKnow: DataTypes.TEXT,
            refundKnow: DataTypes.TEXT,
            category1Id: DataTypes.INTEGER,
            category2Id: DataTypes.INTEGER,
            category3Id: DataTypes.INTEGER,
        },
        {}
    )
    Product.associate = function (models) {
        // associations can be defined here
        Product.belongsTo(models.Brand)
        Product.belongsTo(models.Category1)
        Product.belongsTo(models.Category2)
        Product.belongsTo(models.Category3)
        Product.hasMany(models.OrderItem)
        Product.hasMany(models.CartItem)
    }
    return Product
}
