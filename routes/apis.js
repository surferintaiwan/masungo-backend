const express = require("express")
const router = express.Router()
const db = require("../models")
const Product = db.Product
const passport = require("../config/passport")
const userController = require("../controllers/userController")
const adminController = require("../controllers/adminController")
const productController = require("../controllers/productController")
const cartController = require("../controllers/cartController")
const orderController = require("../controllers/orderController")

const multer = require("multer")
const upload = multer()

const authenticated = passport.authenticate("jwt", { session: false })
const authenticatedAdmin = (req, res, next) => {
    if (req.user) {
        if (req.user.isAdmin) {
            return next()
        }
        return res.json({ status: "error", message: "沒有讀取權限" })
    } else {
        return res.json({ status: "error", message: "沒有這個使用者" })
    }
}

const authenticatedHasTokenOrNot = (req, res, next) => {
    if (req.headers.authorization) {
        authenticated
    } else {
        return next()
    }
}

// 註冊/登入
router.post("/signup", upload.array(), userController.signUp)
router.post("/signIn", userController.signIn)

// ---前台---
// 首頁
router.get("/index", authenticated, (req, res) => {
    Product.findAll().then((products) => {
        return res.json({ products: products })
    })
})
// 獲取現在登入的使用者資訊
router.get("/getcurrentuser", authenticated, userController.getCurrentUser)

// 獲取所有商品分類
router.get("/getallcategories", productController.getAllCategories)

// 商品分類頁
router.get("/categories", productController.getProductsByCategory)

// 商品詳細頁
router.get("/products/:productId", productController.getProductDetail)
router.post(
    "/products/:productId",
    authenticated,
    userController.addFollowingProduct
)
router.delete(
    "/products/:productId",
    authenticated,
    userController.deleteFollowingProduct
)

// 購物車頁
// 因為購物車不一定要登入的使用者才能加入購物車，所以不用經過驗證的middlerware
router.post("/cart", cartController.addCartItem)
router.delete("/cart", cartController.deleteCartItem)
router.get("/cart/:cartId", cartController.getCartItems)

// 會員中心
router.get("/member/orders", authenticated, userController.getOrders)
router.get("/member/followings", authenticated, userController.getFollowings)
router.put(
    "/member/edit",
    upload.array(),
    authenticated,
    userController.updateUser
)

// 結帳頁
router.post(
    "/checkout",
    upload.array(),
    authenticated,
    orderController.createOrder
)

router.get(
    "/checkout/payment/:orderId",
    authenticated,
    orderController.getPayment
)

router.post("/spgateway/callback", orderController.spgatewayCallback)

// ---後台---
router.get(
    "/admin/members",
    authenticated,
    authenticatedAdmin,
    adminController.getMembers
)

module.exports = router
