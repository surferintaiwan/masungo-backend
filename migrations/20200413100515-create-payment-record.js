"use strict"
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("PaymentRecords", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            OrderId: {
                type: Sequelize.INTEGER,
            },
            amount: {
                type: Sequelize.INTEGER,
            },
            paymentStatus: {
                type: Sequelize.BOOLEAN,
            },
            merchantOrderNumber: {
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        })
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable("PaymentRecords")
    },
}
