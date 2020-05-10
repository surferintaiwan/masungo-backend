"use strict"

module.exports = {
    up: (queryInterface, Sequelize) => {
        queryInterface.bulkInsert(
            "Category1s",
            [
                {
                    name: "3C",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "居家",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        )
        queryInterface.bulkInsert(
            "Category2s",
            [
                {
                    name: "通訊設備",
                    Category1Id: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "家具",
                    Category1Id: 11, // 原本是2，但上了heroku會跳號，要改成11
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "家電",
                    Category1Id: 11, // 原本是2，但上了heroku會跳號，要改成11
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        )
        return queryInterface.bulkInsert(
            "Category3s",
            [
                {
                    name: "手機",
                    Category2Id: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "沙發",
                    Category2Id: 11,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "吸塵器",
                    Category2Id: 21, // 原本是2，但上了heroku會跳號，要改成11
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        )
    },

    down: (queryInterface, Sequelize) => {
        queryInterface.bulkDelete("Category1s", null, {})
        queryInterface.bulkDelete("Category2s", null, {})
        return queryInterface.bulkDelete("Category3s", null, {})
    },
}
