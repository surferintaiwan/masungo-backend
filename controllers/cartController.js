const db = require("../models")
const Cart = db.Cart
const CartItem = db.CartItem

const cartController = {
    getCartItems: (req, res) => {
        const cartId = req.params.cartId

        return Cart.findByPk(cartId, {
            include: [{ model: db.CartItem, include: [{ model: db.Product }] }],
        }).then((cart) => {
            // 也許購物車裡面甚麼都沒有，就要給他個空陣列，不然後面要計算金額的時候，會因為cart本身是空的，要cart.Items時會出現問題

            cart = cart || { items: [] }

            let totalPrice =
                cart.CartItems.length > 0
                    ? cart.CartItems.map(
                          (d) => d.Product.sellingPrice * d.quantity
                      ).reduce((a, b) => {
                          return a + b
                      })
                    : 0
            return res.json({ cart: cart, totalPrice: totalPrice })
        })
    },
    addCartItem: (req, res) => {
        const cartId = req.body.cartId
        const productId = req.body.productId
        const amount = req.body.amount

        // 先看有沒有這個購物車，沒有的話就建一個
        return Cart.findOrCreate({
            where: {
                id: cartId || 0, // 如果是完全沒有用過購物車的，從前端帶回來的值會沒有東西，所以給個0去查詢
            },
        }).spread((cart, created) => {
            // 看有沒有該購物車的CartItem紀錄，沒有的話就建一個
            return CartItem.findOrCreate({
                where: {
                    CartId: cart.id,
                    ProductId: productId,
                },
                default: {
                    CartId: cart.id,
                    ProductId: productId,
                },
            }).spread((cartItem, created) => {
                // 到這邊手上已經有cartItem了，可以做儲存數量的動作
                return cartItem
                    .update({
                        quantity: (cartItem.quantity || 0) + amount,
                    })
                    .then((cartItem) => {
                        // 把cartId送回去給前端儲存
                        return res.json({ cartId: cart.id })
                    })
            })
        })
    },
    deleteCartItem: (req, res) => {
        const cartId = req.body.cartId
        const productId = req.body.productId
        console.log(cartId, productId)
        return CartItem.findByPk(cartId, {
            where: { productId: productId },
        }).then((cartItem) => {
            cartItem.destroy().then((cartItem) => {
                return res.json({ status: "OK" })
            })
        })
    },
}

module.exports = cartController
