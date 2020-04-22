"use strict"

module.exports = {
    up: (queryInterface, Sequelize) => {
        // 依據之前新增的兩筆訂單，紀錄付款狀態，一筆付款成功，一筆付款失敗
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
                    ProductId: 2,
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
