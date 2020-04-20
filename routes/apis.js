const express = require("express")
const router = express.Router()
const db = require("../models")
const Product = db.Product
const passport = require("../config/passport")
const userController = require("../controllers/userController")
const adminController = require("../controllers/adminController")
const productController = require("../controllers/productController")
const cartController = require("../controllers/cartController")

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

// 註冊/登入
router.post("/signup", userController.signUp)
router.post("/signIn", userController.signIn)

// 前台
router.get("/index", authenticated, (req, res) => {
    Product.findAll().then((products) => {
        return res.json({ products: products })
    })
})
router.get("/getcurrentuser", authenticated, (req, res) => {
    console.log(req.session)
    console.log(req.sessionId)
    res.json({ user: req.user })
})
router.get("/getallcategories", productController.getAllCategories)

router.get("/categories", productController.getProductsByCategory)

router.get("/products/:productId", productController.getProductDetail)
// 因為購物車不一定要登入的使用者才能加入購物車，所以不用經過驗證的middlerware

router.post("/cart", cartController.addCartItem)
router.delete("/cart", cartController.deleteCartItem)
router.get("/cart/:cartId", cartController.getCartItems)

router.post(
    "/checkout",
    upload.array(),
    authenticated,
    userController.createOrder
)

// 後台
router.get(
    "/admin/members",
    authenticated,
    authenticatedAdmin,
    adminController.getMembers
)

module.exports = router
