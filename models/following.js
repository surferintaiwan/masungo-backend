"use strict"
module.exports = (sequelize, DataTypes) => {
    const Following = sequelize.define(
        "Following",
        {
            UserId: DataTypes.INTEGER,
            ProductId: DataTypes.INTEGER,
        },
        {}
    )
    Following.associate = function (models) {
        // associations can be defined here
    }
    return Following
}
