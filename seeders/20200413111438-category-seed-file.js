"use strict"

module.exports = {
    up: (queryInterface, Sequelize) => {
        queryInterface.bulkInsert(
            "Category1s",
            [
                {
                    name: "居家",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "家電",
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
                    name: "水杯/水瓶/水壺",
                    Category1Id: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "清潔家電",
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
                    name: "保冰/溫杯瓶",
                    Category2Id: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "馬克杯/水杯",
                    Category2Id: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    name: "圓筒吸塵器",
                    Category2Id: 11, // 原本是2，但上了heroku會跳號，要改成11
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
