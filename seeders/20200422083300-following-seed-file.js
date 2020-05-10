"use strict"

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(
            "Followings",
            [
                {
                    UserId: 1,
                    ProductId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    UserId: 1,
                    ProductId: 11, // 原本是2，但上了heroku會跳號，要改成11
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        )
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("Followings", null, {})
    },
}
