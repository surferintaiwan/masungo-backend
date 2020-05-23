const { expect } = require("chai")
const request = require("supertest")
const app = require("../../../app.js")
const db = require("../../../models")
const bcrypt = require("bcryptjs")

describe("# SignUp", () => {
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

describe("# SignIn", function () {
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
