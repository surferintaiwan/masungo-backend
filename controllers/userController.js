const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const db = require("../models")
const User = db.User
const Order = db.Order
const OrderItem = db.OrderItem
const Product = db.Product
const Following = db.Following

// 用自己的gmail當作mail server發信

const userController = {
    signUp: (req, res) => {
        if (req.body.passwordCheck !== req.body.password) {
            return res.json({ status: "error", message: "兩次密碼輸入不相同" })
        } else {
            // 查這個帳號是不是已經被註冊
            User.findOne({ where: { email: req.body.email } }).then((user) => {
                // 如果已被註冊，就返回已註冊訊息
                if (user) {
                    return res.json({
                        status: "error",
                        message: "帳號已被註冊過",
                    })
                } else {
                    // 還沒註冊，就幫他註冊
                    User.create({
                        name: req.body.name,
                        email: req.body.email,
                        password: bcrypt.hashSync(
                            req.body.password,
                            bcrypt.genSaltSync(10),
                            null
                        ),
                        gender: req.body.gender,
                        birthday: req.body.birthday,
                        phone: req.body.phone,
                        address: req.body.address,
                    }).then((user) => {
                        return res.json({
                            status: "success",
                            message: "成功註冊帳號",
                        })
                    })
                }
            })
        }
    },
    signIn: (req, res) => {
        // 檢查帳號密碼是否有填
        if (!req.body.email || !req.body.password) {
            return res.json({ status: "error", message: "請輸入帳號及密碼" })
        }
        let email = req.body.email
        let password = req.body.password

        // 比對帳號密碼是否正確
        User.findOne({ where: { email: email } }).then((user) => {
            if (!user) {
                return res
                    .status(401)
                    .json({ status: "error", message: "沒有這個使用者" })
            }

            if (!bcrypt.compareSync(password, user.password)) {
                return res
                    .status(401)
                    .json({ status: "error", message: "密碼錯誤" })
            }
            // 簽發token
            // 在後續其他頁面登入驗證時，會把JWT解開，並且拿出payload裡的user.id，這樣就能查說這個JWT是他的使用者資料是甚麼
            const payload = { id: user.id }
            const token = jwt.sign(payload, process.env.JWT_SECRET)
            return res.json({
                status: "success",
                message: "ok",
                token: token,
                user: {
                    id: user.id,
                    name: user.name,
                    isAdmin: user.isAdmin,
                    email: user.email,
                },
            })
        })
    },
    getOrders: (req, res) => {
        // 撈出這個使用者所有Order，還有關聯的OrderItems、Products
        Order.findAll({
            where: { userId: req.user.id },
            include: [{ model: OrderItem, include: [{ model: Product }] }],
        }).then((orders) => {
            res.json({ orders })
        })
    },
    addFollowingProduct: (req, res) => {
        Following.create({
            UserId: req.user.id,
            ProductId: req.params.productId,
        }).then((following) => {
            console.log("新增追蹤商品成功")
            res.json({ status: "success" })
        })
    },
    deleteFollowingProduct: (req, res) => {
        Following.findOne({
            where: { UserId: req.user.id, ProductId: req.params.productId },
        }).then((following) => {
            following.destroy().then((following) => {
                console.log("移除追蹤商品成功")
                res.json({ status: "success" })
            })
        })
    },
}

module.exports = userController
