const { expect } = require("chai")
const request = require("supertest")
const app = require("../../../app.js")

const db = require("../../../models")

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
            .expect()
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
                .expect()
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
                .expect()
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
            .expect()
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
