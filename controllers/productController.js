const db = require('../models')
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
            whereQuery['category1Id'] = category1Id
        } else if (category2Id) {
            whereQuery['category2Id'] = category2Id
        } else if (category3Id) {
            whereQuery['category3Id'] = category3Id
        }

        // 判斷有帶品牌Id，才會去查詢該品牌相關的商品
        if (brandId) {
            whereQuery['brandId'] = brandId
        }

        Product.findAll({
            where: whereQuery
        }).then((products) => {
            res.json({ products: products })
        })
    }
}

module.exports = productController
