"use strict"

module.exports = {
    up: (queryInterface, Sequelize) => {
        // 新增兩筆訂單，user1跟user2各1筆
        queryInterface.bulkInsert(
            "Orders",
            [
                {
                    amount: 2000,
                    address: "台北市大同區五湖路40巷80號",
                    receiver: "王小明",
                    UserId: 2,
                    DeliveryMethodId: 1,
                    PaymentMethodId: 1,
                    OrderStatusId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    amount: 500,
                    address: "台北市內湖區健行路80號5樓",
                    UserId: 3,
                    receiver: "陳大東",
                    DeliveryMethodId: 1,
                    PaymentMethodId: 1,
                    OrderStatusId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        )
        // 每筆訂單各有兩種產品
        return queryInterface.bulkInsert(
            "OrderItems",
            [
                {
                    OrderId: 1,
                    ProductId: 1,
                    quantity: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    OrderId: 1,
                    ProductId: 2,
                    quantity: 2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    OrderId: 2,
                    ProductId: 3,
                    quantity: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    OrderId: 2,
                    ProductId: 4,
                    quantity: 2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        )
    },

    down: (queryInterface, Sequelize) => {
        queryInterface.bulkDelete("Orders", null, {})
        return queryInterface.bulkDelete("OrderItems", null, {})
    },
}
