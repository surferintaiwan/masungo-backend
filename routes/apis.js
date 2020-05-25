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
const upload = multer({ dest: "temp/" })

const authenticated = passport.authenticate("jwt", { session: false })
// const authenticated = function (req, res, next) {
//     passport.authenticate("jwt", { session: false }, (err, user, info) => {
//         if (!user) {
//             return res
//                 .status(401)
//                 .json({ status: "error", message: "No auth token" })
//         }
//         req.user = user
//         return next()
//     })(req, res, next)
// }
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
        authenticated(req, res, next)
    } else {
        return next()
    }
}

// 註冊/登入
router.post("/signup", upload.array(), userController.signUp)
router.post("/signIn", userController.signIn)

// ---前台---

// 獲取現在登入的使用者資訊
router.get("/getcurrentuser", authenticated, userController.getCurrentUser)

// 獲取所有商品分類
router.get("/getallcategories", productController.getAllCategories)

// 商品分類頁
router.get(
    "/categories",
    authenticatedHasTokenOrNot,
    productController.getProductsByCategory
)

router.get("/brands", productController.getAllBrands)

// 商品詳細頁
router.get(
    "/products/:productId",
    authenticatedHasTokenOrNot,
    productController.getProductDetail
)
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

router.get(
    "/checkout/finish/:orderId",
    authenticated,
    orderController.getOrderFinish
)

router.post("/spgateway/callback", orderController.spgatewayCallback)

// ---後台---

// 會員管理
router.get(
    "/admin/members",
    authenticated,
    authenticatedAdmin,
    adminController.getAllMembers
)

router.post(
    "/admin/members/:userId",
    authenticated,
    authenticatedAdmin,
    adminController.updateMember
)

// 商品管理
router.get(
    "/admin/products",
    authenticated,
    authenticatedAdmin,
    adminController.getAllProducts
)
router.get(
    "/admin/getAllBrandsAndCategories",
    authenticated,
    authenticatedAdmin,
    adminController.getAllBrandsAndCategories
)

router.post(
    "/admin/products",
    upload.fields([
        { name: "image1" },
        { name: "image2" },
        { name: "image3" },
        { name: "image4" },
        { name: "detail" },
        { name: "deliveryKnow" },
        { name: "refundKnow" },
    ]),
    authenticated,
    authenticatedAdmin,
    adminController.addNewProduct
)

router.get(
    "/admin/products/:productId",
    authenticated,
    authenticatedAdmin,
    adminController.getProduct
)

router.post(
    "/admin/products/:productId",
    upload.fields([
        { name: "image1" },
        { name: "image2" },
        { name: "image3" },
        { name: "image4" },
        { name: "detail" },
        { name: "deliveryKnow" },
        { name: "refundKnow" },
    ]),
    authenticated,
    authenticatedAdmin,
    adminController.updateProduct
)

// 分類管理
router.get(
    "/admin/categories",
    authenticated,
    authenticatedAdmin,
    adminController.getCategories
)
router.post(
    "/admin/categories",
    upload.array(),
    authenticated,
    authenticatedAdmin,
    adminController.addCategory
)
router.put(
    "/admin/categories",
    upload.array(),
    authenticated,
    authenticatedAdmin,
    adminController.updateCategory
)
router.delete(
    "/admin/categories",
    authenticated,
    authenticatedAdmin,
    adminController.deleteCategory
)

// 訂單管理
router.get(
    "/admin/orders",
    authenticated,
    authenticatedAdmin,
    adminController.getAllOrders
)

router.put(
    "/admin/orders/:orderId",
    authenticated,
    authenticatedAdmin,
    adminController.updateOrderShipped
)

// 品牌管理
router.get(
    "/admin/brands",
    authenticated,
    authenticatedAdmin,
    adminController.getAllBrands
)
router.post(
    "/admin/brands",
    authenticated,
    authenticatedAdmin,
    adminController.addBrand
)
router.put(
    "/admin/brands",
    authenticated,
    authenticatedAdmin,
    adminController.updateBrand
)
router.delete(
    "/admin/brands",
    authenticated,
    authenticatedAdmin,
    adminController.deleteBrand
)
module.exports = router
