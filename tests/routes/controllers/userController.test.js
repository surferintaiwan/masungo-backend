const { expect } = require("chai")
const request = require("supertest")
const sinon = require("sinon")
const app = require("../../../app.js")
const db = require("../../../models")
const bcrypt = require("bcryptjs")
const passport = require("../../../config/passport")

describe("# 註冊 - POST /api/signup", () => {
    before(async function () {
        await db.User.destroy({ where: {}, truncate: true })
    })

    it("# 註冊成功", (done) => {
        request(app)
            .post("/api/signup")
            .send(
                "name=name&email=email&password=password&passwordCheck=password"
            )
            .end((err, res) => {
                db.User.findOne({ where: { name: "name" } }).then((user) => {
                    expect(res.statusCode).to.be.equal(200)
                    expect(res.body.message).to.be.equal("成功註冊帳號")
                    expect(user.email).to.be.equal("email")
                    done()
                })
            })
    })

    it("# 帳號已被註冊過", (done) => {
        request(app)
            .post("/api/signup")
            .send(
                "name=name&email=email&password=password&passwordCheck=password"
            )
            .end((err, res) => {
                db.User.findOne({ where: { name: "name" } }).then((user) => {
                    expect(res.statusCode).to.be.equal(200)
                    expect(res.body.message).to.be.equal("帳號已被註冊過")
                    expect(user.email).to.be.equal("email")
                    done()
                })
            })
    })

    it("# 兩次密碼輸入不同", (done) => {
        request(app)
            .post("/api/signup")
            .send(
                "name=name&email=email&password=password&passwordCheck=password2"
            )
            .end((err, res) => {
                expect(res.statusCode).to.be.equal(200)
                expect(res.body.message).to.be.equal("兩次密碼輸入不相同")
                done()
            })
    })
    describe("# 有欄位未填", () => {
        it("# name未填", (done) => {
            request(app)
                .post("/api/signup")
                .send(
                    "name=&email=email&password=password&passwordCheck=password"
                )
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(200)
                    expect(res.body.message).to.be.equal("有欄位未填")
                    done()
                })
        })
        it("# email未填", (done) => {
            request(app)
                .post("/api/signup")
                .send(
                    "name=name&email=&password=password&passwordCheck=password"
                )
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(200)
                    expect(res.body.message).to.be.equal("有欄位未填")
                    done()
                })
        })
    })
    it("# 密碼有誤", (done) => {
        request(app)
            .post("/api/signup")
            .send("name=name&email=&password=password&passwordCheck=password2")
            .end((err, res) => {
                expect(res.statusCode).to.be.equal(200)
                expect(res.body.message).to.be.equal("有欄位未填")
                done()
            })
    })

    after(async function () {
        await await db.User.destroy({ where: {}, truncate: true })
    })
})

describe("# 登入 - POST /api/signin", function () {
    before(async function () {
        await db.User.destroy({ where: {}, truncate: true })
        await db.User.create({
            name: "name",
            email: "email",
            password: bcrypt.hashSync("password", bcrypt.genSaltSync(10), null),
        })
    })
    describe("# 帳號或密碼未輸入", () => {
        it("帳號未輸入", (done) => {
            request(app)
                .post("/api/signin")
                .send("email&password=password")
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(200)
                    expect(res.body.message).to.be.equal("請輸入帳號及密碼")
                    done()
                })
        })
        it("密碼未輸入", (done) => {
            request(app)
                .post("/api/signin")
                .send("email=email&password")
                .end((err, res) => {
                    expect(res.statusCode).to.be.equal(200)
                    expect(res.body.message).to.be.equal("請輸入帳號及密碼")
                    done()
                })
        })
    })

    it("沒有這個使用者", (done) => {
        request(app)
            .post("/api/signin")
            .send("email=mail&password=password")
            .end((err, res) => {
                expect(res.statusCode).to.be.equal(401)
                expect(res.body.message).to.be.equal("沒有這個使用者")
                done()
            })
    })

    it("密碼錯誤", (done) => {
        request(app)
            .post("/api/signin")
            .send("email=email&password=12")
            .end((err, res) => {
                expect(res.statusCode).to.be.equal(401)
                expect(res.body.message).to.be.equal("密碼錯誤")
                done()
            })
    })

    it("# 登入成功，簽發token", (done) => {
        request(app)
            .post("/api/signin")
            .send("email=email&password=password")
            .end((err, res) => {
                expect(res.statusCode).to.be.equal(200)
                expect(res.body.message).to.be.equal("ok")
                done()
            })
    })

    after(async function () {
        await await db.User.destroy({ where: {}, truncate: true })
    })
})

describe("# 獲取目前使用者資料", () => {
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

        // await db.User.destroy({ where: {}, truncate: { cascade: true } })
        // const rootUser = await db.User.create({ name: "name" })
        // this.authenticate = sinon
        //     .stub(passport, "authenticate")
        //     .callsFake((strategy, options, callback) => {
        //         callback(null, { ...rootUser }, null)
        //         return (req, res, next) => {}
        //     })
    })
    it("# 獲取成功", (done) => {
        request(app)
            .get("/api/getcurrentuser")
            .set({
                Authorization: `Bearer ${APIToken}`,
            })
            .end((err, res) => {
                expect(res.statusCode).to.be.equal(200)
                expect(res.body.user.name).to.be.equal("name")
                done()
            })
    })

    after(async function () {
        await db.User.destroy({ where: {}, truncate: true })
        // this.authenticate.restore()
        APIToken = ""
    })
})

describe("# 會員中心", () => {
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
    it("# 更新使用者資料 - PUT /api/member/edit", (done) => {
        request(app)
            .put("/api/member/edit")
            .set({
                Authorization: `Bearer ${APIToken}`,
            })
            .send("name=name&gender=1&birthday=19770604")
            .end((err, res) => {
                expect(res.statusCode).to.be.equal(200)
                expect(res.body.status).to.be.equal("success")
                done()
            })
    })
    it("# 查詢訂單資料 - GET /api/member/orders", (done) => {
        request(app)
            .get("/api/member/orders")
            .set({
                Authorization: `Bearer ${APIToken}`,
            })
            .end((err, res) => {
                expect(res.statusCode).to.be.equal(200)
                expect(res.body.orders.length).to.be.at.least(0)
                done()
            })
    })
    it("# 查詢追蹤清單 - POST /api/member/followings", (done) => {
        request(app)
            .get("/api/member/followings")
            .set({
                Authorization: `Bearer ${APIToken}`,
            })
            .end((err, res) => {
                expect(res.statusCode).to.be.equal(200)
                expect(res.body.followingProducts.length).to.be.at.least(0)
                done()
            })
    })

    after(async function () {
        await db.User.destroy({ where: {}, truncate: true })
        APIToken = ""
    })
})

describe("# 新增/移除追蹤商品", () => {
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
    it("# 新增追蹤商品  - POST /products/:productId", (done) => {
        request(app)
            .post("/api/products/1")
            .set({
                Authorization: `Bearer ${APIToken}`,
            })
            .end((err, res) => {
                expect(res.statusCode).to.be.equal(200)
                expect(res.body.status).to.be.equal("success")
                done()
            })
    })

    it("# 移除追蹤商品  - delete /products/:productId", (done) => {
        request(app)
            .delete("/api/products/1")
            .set({
                Authorization: `Bearer ${APIToken}`,
            })
            .end((err, res) => {
                expect(res.statusCode).to.be.equal(200)
                expect(res.body.status).to.be.equal("success")
                done()
            })
    })
})
