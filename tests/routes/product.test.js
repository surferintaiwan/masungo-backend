// const assert = require("assert")
const chai = require("chai")
const { expect } = require("chai")
const request = require("supertest")

const app = require("../../app")
const db = require("../../models")

describe("# getAllCategories", function () {
    it("GET /getallcategories", (done) => {
        request(app)
            .get("/api/getallcategories")
            .end(function (err, res) {
                // assert.equal("1", "1")
                // assert.match("wo", "w")
                expect(res.statusCode).to.be.equal(200)
                // expect(res.text).to.contain("Register")
                done()
            })
    })
})
