const db = require("../models")
const Category1 = db.Category1
const Product = db.Product
const Brand = db.Brand

const productController = {
    getAllCategories: (req, res) => {
        Category1.findAll().then((category1s) => {
            res.json({ categories: category1s })
        })
    },
    getAllBrands: (req, res) => {
        // 判斷傳進來的是大、中、小類，以及id是甚麼，去找出屬於該類別的商品有哪些
        // 接著把每個商品所屬的品牌(記得要關聯品牌名稱出來用)撈出來變成一個陣列，把裡面重複的刪除再丟回去給前端
        const whichCategory = req.query.whichCategory
        const categoryId = req.query.categoryId
        if (whichCategory === "category1") {
            Product.findAll({
                where: { Category1Id: categoryId },
                include: [{ model: db.Brand }],
            }).then((products) => {
                // 把每個商品的品牌名稱都抽出來組成新的陣列
                const brands = products.map((product) => {
                    return product.Brand.dataValues
                })
                // 接著比對Brand有沒有重複
                const filterBrands = brands.filter((item, index, selfArray) => {
                    return (
                        selfArray.findIndex((i) => i.id === item.id) === index
                    )
                })
                res.json({ brands: filterBrands })
            })
        } else if (whichCategory === "category2") {
            Product.findAll({
                where: { Category2Id: categoryId },
                include: [{ model: db.Brand }],
            }).then((products) => {
                // 把每個商品的品牌名稱都抽出來組成新的陣列
                const brands = products.map((product) => {
                    return product.Brand.dataValues
                })
                // 接著比對Brand有沒有重複
                const filterBrands = brands.filter((item, index, selfArray) => {
                    return (
                        selfArray.findIndex((i) => i.id === item.id) === index
                    )
                })
                res.json({ brands: filterBrands })
            })
        } else if (whichCategory === "category3") {
            Product.findAll({
                where: { Category3Id: categoryId },
                include: [{ model: db.Brand }],
            }).then((products) => {
                // 把每個商品的品牌名稱都抽出來組成新的陣列
                const brands = products.map((product) => {
                    return product.Brand.dataValues
                })
                // 接著比對Brand有沒有重複
                const filterBrands = brands.filter((item, index, selfArray) => {
                    return (
                        selfArray.findIndex((i) => i.id === item.id) === index
                    )
                })
                res.json({ brands: filterBrands })
            })
        }
    },
    getProductsByCategory: (req, res) => {
        const category1Id = req.query.category1Id
        const category2Id = req.query.category2Id
        const category3Id = req.query.category3Id
        const brandId = req.query.brandId
        const sort = req.query.sort
        const whereQuery = {}
        const sortQuery = []

        // 判斷是否有帶大/中/小分類的Id，才會去查詢該分類相關的商品
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

        // 判斷有要求排序方式的話，就要帶不同的排序參數進去
        if (sort === "sellingPriceDESC") {
            sortQuery.push(["sellingPrice", "DESC"])
        } else if (sort === "sellingPriceASC") {
            sortQuery.push(["sellingPrice", "ASC"])
        } else if (sort === "createdAtDESC") {
            sortQuery.push(["createdAt", "DESC"])
        } else if (sort === "createdAtASC") {
            sortQuery.push(["createdAt", "ASC"])
        }

        Product.findAll({
            where: whereQuery,
            order: sortQuery,
        }).then((products) => {
            // 判斷有帶搜尋關鍵字，就要去比對哪些商品符合該關鍵字
            const keyword = req.query.keyword
            if (keyword) {
                const regex = new RegExp(keyword, "i")
                products = products.filter((product) =>
                    product.name.match(regex)
                )
            }
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
