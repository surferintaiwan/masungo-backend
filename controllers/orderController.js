const db = require("../models")
const User = db.User
const Order = db.Order
const CartItem = db.CartItem
const OrderItem = db.OrderItem
const PaymentRecord = db.PaymentRecord
const nodemailer = require("nodemailer")
const crypto = require("crypto")

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.gmail_user,
        pass: process.env.gmail_pass,
    },
})

// 產生交易資料給藍新
const URL = process.env.URL
const BackEndURL = process.env.BackEndURL
const MerchantID = process.env.MerchantID
const HashKey = process.env.HashKey
const HashIV = process.env.HashIV
const PayGateWay = "https://ccore.spgateway.com/MPG/mpg_gateway" // 要把交易資料以formdata格式打給API的網址
const ReturnURL = URL + "/api/spgateway/callback?from=ReturnURL"
const NotifyURL = URL + "/api/spgateway/callback?from=NotifyURL"
const ClientBackURL = BackEndURL + "/cart"

// 1.產生交易資料之字串
function genDataChain(TradeInfo) {
    let results = []
    for (let kv of Object.entries(TradeInfo)) {
        results.push(`${kv[0]}=${kv[1]}`)
    }
    return results.join("&")
}

// 2.將交易資料字串以aes加密
function create_mpg_aes_encrypt(TradeInfo) {
    let encrypt = crypto.createCipheriv("aes256", HashKey, HashIV)
    let enc = encrypt.update(genDataChain(TradeInfo), "utf8", "hex")
    return enc + encrypt.final("hex")
}

// 3.將aes加密結果以sha雜湊
function create_mpg_sha_encrypt(TradeInfo) {
    let sha = crypto.createHash("sha256")
    let plainText = `HashKey=${HashKey}&${TradeInfo}&HashIV=${HashIV}`

    return sha.update(plainText).digest("hex").toUpperCase()
}

function create_mpg_aes_decrypt(TradeInfo) {
    let decrypt = crypto.createDecipheriv("aes256", HashKey, HashIV)
    decrypt.setAutoPadding(false)
    let text = decrypt.update(TradeInfo, "hex", "utf8")
    let plainText = text + decrypt.final("utf8")
    let result = plainText.replace(/[\x00-\x20]+/g, "")
    return result
}

function getFinalTradeInfo(orderAmount, orderUserName, orderUserEmail) {
    console.log("===== getOriginalTradeInfo =====")
    console.log(orderAmount, orderUserName, orderUserEmail)
    console.log("==========")

    const timeStamp = Date.now()
    const data = {
        MerchantID: MerchantID, // 商店代號
        Version: "1.5", // 串接版本
        RespondType: "JSON",
        TimeStamp: timeStamp, //時間戳記
        MerchantOrderNo: timeStamp, // 訂單編號
        LoginType: 0, // 是否要登入智付通會員
        OrderComment: "OrderComment", // 商店備註
        Amt: orderAmount, //訂單金額
        ItemDesc: orderUserName, // 先以使用者名稱暫代
        Email: orderUserEmail, // 付款人email
        ReturnURL: ReturnURL, // 支付完成返回商店網址(會回傳一次)
        NotifyURL: NotifyURL, // 支付完成回傳(會回傳三次)
        ClientBackURL: ClientBackURL, // 支付取消返回商店網址
    }

    console.log("===== getTradeInfo: data =====")
    console.log(data)

    const mpg_aes_encrypt = create_mpg_aes_encrypt(data)
    const mpg_sha_encrypt = create_mpg_sha_encrypt(mpg_aes_encrypt)

    console.log("===== getTradeInfo: mpg_aes_encrypt, mpg_sha_encrypt =====")
    console.log(mpg_aes_encrypt)
    console.log(mpg_sha_encrypt)

    const finalTradeInfo = {
        MerchantID: MerchantID,
        TradeInfo: mpg_aes_encrypt,
        TradeSha: mpg_sha_encrypt,
        Version: "1.5",
        PayGateWay: PayGateWay,
        timeStamp: timeStamp,
    }

    console.log("===== getTradeInfo: finalTradeInfo =====")
    console.log(finalTradeInfo)

    // // 這一段留著問助教，為什麼這樣寫外面會收不到資料
    // // 這邊要記錄每次發起交易的紀錄，因為有可能使用者這次交易失敗，過10分鐘又發起交易
    // PaymentRecord.create({
    //     OrderId: orderId,
    //     amount: orderAmount,
    //     paymentStatus: false, // 預設是false，等到使用者去到藍新那邊刷卡成功，藍新回覆給我們的時候才透過merChantOrderNumber查詢這張表，並轉成true
    //     merchantOrderNumber: timeStamp,
    // }).then((paymentRecord) => {
    //     console.log("交易紀錄已寫入")
    //     return finalTradeInfo
    // })

    return finalTradeInfo
}

const orderController = {
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
            // 撈出該筆cartId的CartItem，把資料逐一複製一份到OrderItem
            let results = []
            return CartItem.findAll({ where: { cartId } }).then((cartItems) => {
                for (let i = 0; i < cartItems.length; i++) {
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
                    // 找出他的mail，發出訂單成立通知信
                    User.findByPk(userId).then((user) => {
                        const mailOptions = {
                            from: "seoneedtime@gmail.com",
                            to: user.email,
                            subject: `馬上購線上購物，訂單編號: ${order.id}，訂單成立`,
                            html: ` <div style="display: inline-block; min-width: 300px; background-color: white;">
                            <h1>您在馬上購的訂單成立</h1>
                            <h2>訂單編號: ${order.id}</h2>
                            <h3>總金額：${order.amount}</h3>
                          </div>
                          `,
                        }
                        transporter.sendMail(mailOptions, function (
                            error,
                            info
                        ) {
                            if (error) {
                                console.log(error)
                            } else {
                                console.log("Email sent: " + info.response)
                            }
                        })

                        // 把它的購物車CartItem清空
                        CartItem.destroy({ where: { cartId } }).then(
                            (cartItems) => {
                                console.log("刪除完成")

                                res.json({
                                    status: "success",
                                    orderId: order.id,
                                })
                            }
                        )
                    })
                })
            })
        })
    },
    getPayment: (req, res) => {
        return Order.findByPk(req.params.orderId, {
            include: [{ model: User }],
        }).then((order) => {
            const finalTradeInfo = getFinalTradeInfo(
                order.amount,
                order.User.name,
                order.User.email
            )
            // 這邊要記錄每次發起交易的紀錄，因為有可能使用者這次交易失敗，過10分鐘又發起交易
            return PaymentRecord.create({
                OrderId: order.id,
                amount: order.amount,
                paymentStatus: false, // 預設是false，等到使用者去到藍新那邊刷卡成功，藍新回覆給我們的時候才透過merChantOrderNumber查詢這張表，並轉成true
                merchantOrderNumber: finalTradeInfo.timeStamp,
            }).then((paymentRecord) => {
                console.log("交易紀錄已寫入")
                return res.json({ orderAmount: order.amount, finalTradeInfo })
            })
            // return res.json({ orderAmount: order.amount, finalTradeInfo })
        })
    },
    getOrderFinish: (req, res) => {
        Order.findByPk(req.params.orderId, {
            include: [
                { model: db.DeliveryMethod },
                { model: db.PaymentMethod },
                { model: db.OrderItem, include: [{ model: db.Product }] },
            ],
        }).then((order) => {
            // 判斷這個人是不是該筆訂單擁有者，才回傳資料
            if (req.user.id === order.UserId) {
                return res.json({ order })
            } else {
                return res.json({ status: "error" })
            }
        })
    },
    spgatewayCallback: (req, res) => {
        console.log("===== spgatewayCallback =====")
        console.log(req.method)
        console.log(req.query)
        console.log(req.body)
        console.log("==========")

        // 判斷回來的query是ReturnURL還是NotifyURL
        if (req.query.from === "NotifyURL") {
            return
        } else if (req.query.from === "ReturnURL") {
            // 把藍新回傳的資料反解
            const data = JSON.parse(create_mpg_aes_decrypt(req.body.TradeInfo))
            console.log(
                "===== spgatewayCallback: create_mpg_aes_decrypt、data ====="
            )
            console.log(data)

            // 透過藍新回傳的資料更新交易紀錄
            PaymentRecord.findOne({
                where: { merchantOrderNumber: data.Result.MerchantOrderNo },
            }).then((paymentRecord) => {
                // 將付款狀態從原本的付款未完成0，變成付款已完成1
                paymentRecord
                    .update({
                        paymentStatus: 1,
                    })
                    .then((paymentRecord) => {
                        // 更新訂單狀態從原本的待付款1，變成訂單處理中2
                        Order.findByPk(paymentRecord.OrderId).then((order) => {
                            order
                                .update({
                                    OrderStatusId: 11, // 原本是2，但上了heroku會跳號，所以要改成11
                                })
                                .then((order) => {
                                    // 跳轉回前端的訂單完成頁
                                    res.redirect(
                                        `${BackEndURL}/checkout/finish/${order.id}`
                                    )
                                })
                        })
                    })
            })
        }
    },
}

module.exports = orderController
