const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const db = require("../models")
const User = db.User
const Order = db.Order
const Cart = db.Cart
const CartItem = db.CartItem
const OrderItem = db.OrderItem

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
    createOrder: (req, res) => {
        const userId = req.user.id
        const receiver = req.body.receiver
        const paymentMethodId = req.body.paymentMethodId
        const deliveryMethodId = req.body.deliveryMethodId
        const address = req.body.address
        const amount = req.body.amount
        const cartId = req.body.cartId
        // 建立一筆Order
        return Order.create({
            userId,
            paymentMethodId,
            deliveryMethodId,
            address,
            amount,
            receiver,
            // 剛送出訂單，先給他一個orderStatusId是待付款:1，等到稍後金流確實付款了才改成訂單處理中:2
            orderStatusId: 1,
        }).then((order) => {
            // 撈出該筆cartId的CartItem，把資料逐一搬到OrderItem
            let results = []
            return CartItem.findAll({ where: { cartId } }).then((cartItems) => {
                for (let i = 0; i < cartItems.length; i++) {
                    console.log(
                        11111111,
                        order.id,
                        cartItems[i].ProductId,
                        cartItems[i].quantity
                    )
                    // 因為不確定甚麼時候會做完，所以塞進一個results陣列給Promise.all監控
                    results.push(
                        OrderItem.create({
                            OrderId: order.id,
                            ProductId: cartItems[i].ProductId,
                            quantity: cartItems[i].quantity,
                        })
                    )
                }

                return Promise.all(results).then(() => {
                    res.json({ status: "success" })
                    // 確定訂單成立，把它的購物車CartItem清空
                    CartItem.destroy({ where: { cartId } }).then(
                        (cartItems) => {
                            console.log("刪除完成")
                        }
                    )
                })
            })
        })
    },
}

module.exports = userController
