const { expect } = require("chai")
const request = require("supertest")
const sinon = require("sinon")
const app = require("../../../app.js")
const db = require("../../../models")
const bcrypt = require("bcryptjs")

// 這邊先拿到token給後面的測試用，有需要帶token的就直接set帶上即可，不需要就不用帶上
let APIToken = ""
before(async function () {
    await db.User.destroy({ where: {}, truncate: { cascade: true } })
    await db.User.create({
        name: "name",
        email: "email",
        password: bcrypt.hashSync("password", bcrypt.genSaltSync(10), null),
    })
    const res = await request(app)
        .post("/api/signin")
        .send("email=email&password=password")
    APIToken = res.body.token
})

after(function () {
    APIToken = ""
})

describe("# 獲取所有分類項目 GET /getallcategories", () => {
    before(async function () {
        await db.Category1.create({
            name: "居家",
        })
        await db.Category2.create({
            name: "水杯",
            Category1Id: 1,
        })
        await db.Category3.create({
            name: "馬克水杯",
            Category2Id: 1,
        })
    })
    it("# 獲取成功", (done) => {
        request(app)
            .get("/api/getallcategories")
            .end((err, res) => {
                expect(res.statusCode).to.be.equal(200)
                // console.log(res.body.category1s[0])
                expect(
                    res.body.category1s[0].Category2s[0].Category3s[0].name
                ).to.be.equal("馬克水杯")
                done()
            })
    })
    after(async function () {
        await db.Category1.destroy({ where: {}, truncate: true })
        await db.Category2.destroy({ where: {}, truncate: true })
        await db.Category3.destroy({ where: {}, truncate: true })
    })
})

describe("# 獲取特定分類的所有品牌項目 GET /brands", () => {
    before(async function () {
        await db.Brand.create({
            name: "新品牌",
        })
        await db.Category1.create({
            name: "居家",
        })
        await db.Category2.create({
            name: "水杯",
            Category1Id: 1,
        })
        await db.Category3.create({
            name: "馬克水杯",
            Category2Id: 1,
        })
        await db.Product.create({
            name: "超好用杯子",
            BrandId: 1,
            Category1Id: 1,
            Category2Id: 1,
            Category3Id: 1,
        })
    })

    it("# 獲取特定大分類的所有品牌項目 - GET /api/brands?whichCategory=category1&categoryId=1", (done) => {
        request(app)
            .get("/api/brands?whichCategory=category1&categoryId=1")
            .end((err, res) => {
                expect(res.statusCode).to.be.equal(200)
                expect(res.body.brands[0].name).to.be.equal("新品牌")
                done()
            })
    })

    it("# 獲取特定中分類的所有品牌項目 - GET /api/brands?whichCategory=category2&categoryId=1", (done) => {
        request(app)
            .get("/api/brands?whichCategory=category2&categoryId=1")
            .end((err, res) => {
                expect(res.statusCode).to.be.equal(200)
                expect(res.body.brands[0].name).to.be.equal("新品牌")
                done()
            })
    })

    it("# 獲取特定小分類的所有品牌項目 - GET /api/brands?whichCategory=category3&categoryId=1", (done) => {
        request(app)
            .get("/api/brands?whichCategory=category3&categoryId=1")
            .end((err, res) => {
                expect(res.statusCode).to.be.equal(200)
                expect(res.body.brands[0].name).to.be.equal("新品牌")
                done()
            })
    })
    after(async function () {
        // 發現有加上這行的話，獲取特定大分類的所有品牌項目就會時好時壞，但大部分時候都是壞的就是了。
        // await db.Brand.destroy({ where: {}, truncate: true })
        await db.Category1.destroy({ where: {}, truncate: true })
        await db.Category2.destroy({ where: {}, truncate: true })
        await db.Category3.destroy({ where: {}, truncate: true })
        await db.Product.destroy({ where: {}, truncate: true })
    })
})

describe("# 商品分類頁 - GET /api/categories", function () {
    before(async function () {
        await db.Category1.create({
            name: "居家",
        })
        await db.Category2.create({
            name: "水杯",
            Category1Id: 1,
        })
        await db.Category3.create({
            name: "馬克水杯",
            Category2Id: 1,
        })
        await db.Category2.create({
            name: "盥洗用具",
            Category1Id: 2,
        })
        await db.Category3.create({
            name: "潔牙用品",
            Category2Id: 2,
        })
        await db.Product.create({
            name: "super好用杯子",
            BrandId: 1,
            Category1Id: 1,
            Category2Id: 1,
            Category3Id: 1,
        })
        await db.Product.create({
            name: "super好用牙刷",
            BrandId: 2,
            Category1Id: 1,
            Category2Id: 2,
            Category3Id: 2,
        })
    })
    describe("# 有帶token的", function () {
        it("# 查找特定大分類的所有商品", function (done) {
            request(app)
                .get("/api/categories?category1Id=1")
                .set({
                    Authorization: `Bearer ${APIToken}`,
                })
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(200)
                    expect(res.body.products[0].name).to.be.equal(
                        "super好用杯子"
                    )
                    done()
                })
        })
        it("# 查找特定中分類的所有商品", function (done) {
            request(app)
                .get("/api/categories?category2Id=1")
                .set({
                    Authorization: `Bearer ${APIToken}`,
                })
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(200)
                    expect(res.body.products[0].name).to.be.equal(
                        "super好用杯子"
                    )
                    done()
                })
        })
        it("# 查找特定小分類的所有商品", function (done) {
            request(app)
                .get("/api/categories?category3Id=2")
                .set({
                    Authorization: `Bearer ${APIToken}`,
                })
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(200)
                    expect(res.body.products[0].name).to.be.equal(
                        "super好用牙刷"
                    )
                    done()
                })
        })
        it("# 查找特定關鍵字的所有商品", function (done) {
            request(app)
                .get("/api/categories?keyword=super")
                .set({
                    Authorization: `Bearer ${APIToken}`,
                })
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(200)
                    expect(res.body.products.length).to.be.equal(2)
                    done()
                })
        })
        it("# 查找特定品牌的所有商品", function (done) {
            request(app)
                .get("/api/categories?brandId=1")
                .set({
                    Authorization: `Bearer ${APIToken}`,
                })
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(200)
                    expect(res.body.products.length).to.be.equal(1)
                    done()
                })
        })
        it("# 查找特定大分類+特定關鍵字的所有商品", function (done) {
            request(app)
                .get("/api/categories?category1Id=1&keyword=super")
                .set({
                    Authorization: `Bearer ${APIToken}`,
                })
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(200)
                    expect(res.body.products.length).to.be.equal(2)
                    done()
                })
        })
        it("# 查找特定大分類+特定關鍵字+特定品牌的所有商品", function (done) {
            request(app)
                .get("/api/categories?category1Id=1&keyword=super&brandId=1")
                .set({
                    Authorization: `Bearer ${APIToken}`,
                })
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(200)
                    expect(res.body.products.length).to.be.equal(1)
                    done()
                })
        })
        it("# 查找特定關鍵字+特定品牌的所有商品", function (done) {
            request(app)
                .get("/api/categories?keyword=super&brandId=1")
                .set({
                    Authorization: `Bearer ${APIToken}`,
                })
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(200)
                    expect(res.body.products.length).to.be.equal(1)
                    done()
                })
        })
    })
    describe("沒帶token的", function () {
        it("# 查找特定大分類的所有商品", function (done) {
            request(app)
                .get("/api/categories?category1Id=1")
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(200)
                    expect(res.body.products[0].name).to.be.equal(
                        "super好用杯子"
                    )
                    done()
                })
        })
        it("# 查找特定中分類的所有商品", function (done) {
            request(app)
                .get("/api/categories?category2Id=1")
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(200)
                    expect(res.body.products[0].name).to.be.equal(
                        "super好用杯子"
                    )
                    done()
                })
        })
        it("# 查找特定小分類的所有商品", function (done) {
            request(app)
                .get("/api/categories?category3Id=2")
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(200)
                    expect(res.body.products[0].name).to.be.equal(
                        "super好用牙刷"
                    )
                    done()
                })
        })
        it("# 查找特定關鍵字的所有商品", function (done) {
            request(app)
                .get("/api/categories?keyword=super")
                .set({
                    Authorization: `Bearer ${APIToken}`,
                })
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(200)
                    expect(res.body.products.length).to.be.equal(2)
                    done()
                })
        })
        it("# 查找特定品牌的所有商品", function (done) {
            request(app)
                .get("/api/categories?brandId=1")
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(200)
                    expect(res.body.products.length).to.be.equal(1)
                    done()
                })
        })
        it("# 查找特定大分類+特定關鍵字的所有商品", function (done) {
            request(app)
                .get("/api/categories?category1Id=1&keyword=super")
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(200)
                    expect(res.body.products.length).to.be.equal(2)
                    done()
                })
        })
        it("# 查找特定大分類+特定關鍵字+特定品牌的所有商品", function (done) {
            request(app)
                .get("/api/categories?category1Id=1&keyword=super&brandId=1")
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(200)
                    expect(res.body.products.length).to.be.equal(1)
                    done()
                })
        })
        it("# 查找特定關鍵字+特定品牌的所有商品", function (done) {
            request(app)
                .get("/api/categories?keyword=super&brandId=1")
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(200)
                    expect(res.body.products.length).to.be.equal(1)
                    done()
                })
        })
    })

    after(async function () {
        await db.Brand.destroy({ where: {}, truncate: true })
        await db.Category1.destroy({ where: {}, truncate: true })
        await db.Category2.destroy({ where: {}, truncate: true })
        await db.Category3.destroy({ where: {}, truncate: true })
        await db.Product.destroy({ where: {}, truncate: true })
    })
})

describe("# 商品詳細頁 - GET /products/:productId", function () {
    before(async function () {
        await db.Product.create({
            name: "super好用杯子",
        })
    })
    it("# 有帶token", function (done) {
        request(app)
            .get("/api/products/1")
            .set({
                Authorization: `Bearer ${APIToken}`,
            })
            .end((err, res) => {
                expect(res.statusCode).to.be.equal(200)
                expect(res.body.product.name).to.be.equal("super好用杯子")
                done()
            })
    })
    it("# 沒帶token", function (done) {
        request(app)
            .get("/api/products/1")
            .end((err, res) => {
                expect(res.statusCode).to.be.equal(200)
                expect(res.body.product.name).to.be.equal("super好用杯子")
                done()
            })
    })
    after(async function () {
        await db.Product.destroy({ where: {}, truncate: true })
    })
})
