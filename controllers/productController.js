const db = require("../models")
const Category1 = db.Category1
const Product = db.Product

const productController = {
    getAllCategories: (req, res) => {
        Category1.findAll().then((category1s) => {
            res.json({ categories: category1s })
        })
    },
    getProductsByCategory: (req, res) => {
        const category1Id = req.query.category1Id
        const category2Id = req.query.category2Id
        const category3Id = req.query.category3Id
        const brandId = req.query.brandId

        // 判斷是否有帶大/中/小分類的Id，才會去查詢該分類相關的商品
        const whereQuery = {}
        if (category1Id) {
            whereQuery["category1Id"] = category1Id
        } else if (category2Id) {
            whereQuery["category2Id"] = category2Id
        } else if (category3Id) {
            whereQuery["category3Id"] = category3Id
        }

        // 判斷有帶品牌Id，才會去查詢該品牌相關的商品
        if (brandId) {
            whereQuery["brandId"] = brandId
        }

        Product.findAll({
            where: whereQuery,
        }).then((products) => {
            // 判斷有沒有帶token，有帶token進來的來就要去比對，否則就直接回傳沒有加工過的product回去
            if (req.user) {
                // 要比對每個商品是不是有被縣在這個使用者追蹤過，在每個商品塞個isFollowed回去
                // 所以要把所有商品跑迴圈一個一個取出，跟現在這個使用者有追蹤過的商品比對
                products = products.map((product) => {
                    return {
                        ...product.dataValues,
                        // 比對看看使用者所有追蹤商品中有沒有現在這個product，去回傳true或flase
                        isFollowed: req.user.FollowingProducts.map(
                            (followingProduct) => {
                                return followingProduct.id
                            }
                        ).includes(product.id),
                    }
                })
                res.json({ products })
            } else {
                res.json({ products })
            }
        })
    },
    getProductDetail: (req, res) => {
        Product.findByPk(req.params.productId, {
            include: [
                { model: db.Brand },
                { model: db.User, as: "FollowedByUsers" },
            ],
        }).then((product) => {
            req.user ? (userId = req.user.id) : (userId = -1)
            product = {
                ...product.dataValues,
                isFollowed: product.FollowedByUsers.map((d) => d.id).includes(
                    userId
                ),
            }
            res.json({ product })
        })
    },
}

module.exports = productController
