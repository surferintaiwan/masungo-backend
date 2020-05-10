"use strict"

const faker = require("faker")

module.exports = {
    up: (queryInterface, Sequelize) => {
        // 總共新增30筆產品資料，分3次10筆新增
        // 10筆: 居家> 水杯/水瓶/水壺> 保冰/溫杯瓶
        // 10筆: 居家> 水杯/水瓶/水壺> 馬克杯/水杯
        // 10筆: 家電> 清潔家電> 圓筒吸塵器
        queryInterface.bulkInsert(
            "Products",
            Array.from({ length: 10 }).map((d) => {
                const listPrice = faker.commerce.price()
                return {
                    name: faker.commerce.productName(),
                    BrandId:
                        Math.floor(Math.random() * 5) * // 原本只要寫Math.floor(Math.random() * 5)就可以了，但因為heroku會跳10號，所以要改寫
                            Math.ceil(Math.random() * 10) +
                        1,
                    listPrice: listPrice,
                    sellingPrice: listPrice - 10,
                    inventory: faker.random.number(),
                    sellingStatus: faker.random.boolean(),
                    shippingFee: faker.random.boolean(),
                    image1:
                        "https://img2.momoshop.com.tw/goodsimg/0007/652/325/7652325_R1.jpg?t=1588605988",
                    image2:
                        "https://img2.momoshop.com.tw/goodsimg/0007/652/325/7652325_R2.jpg?t=1588605988",
                    image3:
                        "https://img2.momoshop.com.tw/goodsimg/0007/652/325/7652325_R3.jpg?t=1588605988",
                    image4:
                        "https://img2.momoshop.com.tw/goodsimg/0007/652/325/7652325_R4.jpg?t=1588605988",
                    detail:
                        "https://img3.momoshop.com.tw/expertimg/0007/471/442/01.jpg?t=1582773227401",
                    deliveryKnow:
                        "http://www.kphoto.com.tw/image/catalog/event/%E7%B6%B2%E8%B3%BC%E5%BF%AB%E9%80%9F%E9%80%81.jpg",
                    refundKnow:
                        "https://motomarket.cc/image/catalog/2019/%E9%A0%81%E9%9D%A2%E7%AE%A1%E7%90%86/201811191554.jpg",
                    Category1Id: 1,
                    Category2Id: 1,
                    Category3Id: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            }),
            {}
        )
        queryInterface.bulkInsert(
            "Products",
            Array.from({ length: 10 }).map((d) => {
                const listPrice = faker.commerce.price()
                return {
                    name: faker.commerce.productName(),
                    BrandId:
                        Math.floor(Math.random() * 5) * // 原本只要寫Math.floor(Math.random() * 5)就可以了，但因為heroku會跳10號，所以要改寫
                            Math.ceil(Math.random() * 10) +
                        1,
                    listPrice: listPrice,
                    sellingPrice: listPrice - 10,
                    inventory: faker.random.number(),
                    sellingStatus: faker.random.boolean(),
                    shippingFee: faker.random.boolean(),
                    image1:
                        "https://img1.momoshop.com.tw/goodsimg/0007/541/824/7541824_R.jpg?t=1588429436",
                    image2:
                        "https://img1.momoshop.com.tw/goodsimg/0007/541/824/7541824_R1.jpg?t=1588429436",
                    image3:
                        "https://img1.momoshop.com.tw/goodsimg/0007/541/824/7541824_R2.jpg?t=1588429436",
                    image4:
                        "https://img1.momoshop.com.tw/goodsimg/0007/541/824/7541824_R3.jpg?t=1588429436",
                    detail:
                        "https://img3.momoshop.com.tw/expertimg/0007/471/442/01.jpg?t=1582773227401",
                    deliveryKnow:
                        "http://www.kphoto.com.tw/image/catalog/event/%E7%B6%B2%E8%B3%BC%E5%BF%AB%E9%80%9F%E9%80%81.jpg",
                    refundKnow:
                        "https://motomarket.cc/image/catalog/2019/%E9%A0%81%E9%9D%A2%E7%AE%A1%E7%90%86/201811191554.jpg",
                    Category1Id: 1,
                    Category2Id: 1,
                    Category3Id: 11, // 原本在本地端寫2就可以了，但上了heroku，分類會跳10號，所以必須改寫成11
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            }),
            {}
        )
        return queryInterface.bulkInsert(
            "Products",
            Array.from({ length: 10 }).map((d) => {
                const listPrice = faker.commerce.price()
                return {
                    name: faker.commerce.productName(),
                    BrandId:
                        Math.floor(Math.random() * 5) * // 原本只要寫Math.floor(Math.random() * 5)就可以了，但因為heroku會跳10號，所以要改寫
                            Math.ceil(Math.random() * 10) +
                        1,
                    listPrice: listPrice,
                    sellingPrice: listPrice - 10,
                    inventory: faker.random.number(),
                    sellingStatus: faker.random.boolean(),
                    shippingFee: faker.random.boolean(),
                    image1:
                        "https://img4.momoshop.com.tw/goodsimg/0007/200/249/7200249_R.jpg?t=1582202250",
                    image2:
                        "https://img4.momoshop.com.tw/goodsimg/0007/200/249/7200249_R1.jpg?t=1582202250",
                    image3:
                        "https://img4.momoshop.com.tw/goodsimg/0007/200/249/7200249_R2.jpg?t=1582202250",
                    image4:
                        "https://img4.momoshop.com.tw/goodsimg/0007/200/249/7200249_R3.jpg?t=1582202250",
                    detail:
                        "https://img3.momoshop.com.tw/expertimg/0007/471/442/01.jpg?t=1582773227401",
                    deliveryKnow:
                        "http://www.kphoto.com.tw/image/catalog/event/%E7%B6%B2%E8%B3%BC%E5%BF%AB%E9%80%9F%E9%80%81.jpg",
                    refundKnow:
                        "https://motomarket.cc/image/catalog/2019/%E9%A0%81%E9%9D%A2%E7%AE%A1%E7%90%86/201811191554.jpg",
                    Category1Id: 11, // 原本在本地端寫2就可以了，但上了heroku，分類會跳10號，所以必須改寫成11
                    Category2Id: 11, // 原本在本地端寫2就可以了，但上了heroku，分類會跳10號，所以必須改寫成11
                    Category3Id: 21, // 原本在本地端寫3就可以了，但上了heroku，分類會跳10號，所以必須改寫成21
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            }),
            {}
        )
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("Products", null, {})
    },
}
