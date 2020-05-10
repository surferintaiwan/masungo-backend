"use strict"

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            "Brands",
            [
                {
                    name: "三星",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "IKEA",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "Dyson",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "iRobot",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        )
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("Brands", null, {})
    },
}
