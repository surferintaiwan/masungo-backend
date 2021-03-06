const fs = require("fs")
const fsPromises = fs.promises
const db = require("../models")
const User = db.User
const Product = db.Product
const Brand = db.Brand
const Category1 = db.Category1
const Category2 = db.Category2
const Category3 = db.Category3
const Order = db.Order
const OrderStatus = db.OrderStatus
const URL = process.env.URL

const adminController = {
    getAllMembers: (req, res) => {
        User.findAll({ include: [{ model: Order }] }).then((users) => {
            let updatedUsers = users.map((user) => {
                // 連這個也要用let才行
                let totalAmount = 0 // 為什麼不能用const呢?
                user.Orders.forEach((order) => {
                    totalAmount += order.amount
                })
                return {
                    ...user.dataValues,
                    totalAmount,
                }
            })
            updatedUsers = updatedUsers.sort((a, b) => {
                return a.id - b.id
            })
            res.json({ members: updatedUsers })
        })
    },
    updateMember: (req, res) => {},
    getAllProducts: (req, res) => {
        Product.findAll().then((products) => {
            res.json({ products })
        })
    },
    getAllBrandsAndCategories: (req, res) => {
        Brand.findAll().then((brands) => {
            Category1.findAll().then((category1s) => {
                Category2.findAll().then((category2s) => {
                    Category3.findAll().then((category3s) => {
                        return res.json({
                            brands,
                            category1s,
                            category2s,
                            category3s,
                        })
                    })
                })
            })
        })
    },
    addNewProduct: (req, res) => {
        const { files } = req
        const filesNewPath = {}
        const results = []
        // 如果有檔案資料，就去把每一筆圖片存到upload資料夾
        if (Object.keys(files).length !== 0) {
            // files裡面是一包物件，所以需要跑物件迴圈把每一個圖片取出來做轉移
            for (let [key, value] of Object.entries(files)) {
                results.push(
                    (async function () {
                        let data = await fsPromises.readFile(value[0].path)
                        let final = await fsPromises.writeFile(
                            `upload/${value[0].originalname}`,
                            data
                        )
                        return (filesNewPath[
                            key
                        ] = `${URL}/upload/${value[0].originalname}`)
                    })()
                )
            }
            // 確定所有圖片都轉移至upload後才新增到資料庫

            return Promise.all(results).then(() => {
                console.log(results)
                return Product.create({
                    name: req.body.name,
                    BrandId: req.body.brandId,
                    listPrice: req.body.listPrice,
                    sellingPrice: req.body.sellingPrice,
                    inventory: req.body.inventory,
                    sellingStatus: req.body.sellingStatus,
                    shippingFee: req.body.shippingFee,
                    Category1Id: req.body.category1Id,
                    Category2Id: req.body.category2Id,
                    Category3Id: req.body.category3Id,
                    ...filesNewPath, // 直接把前面準備好的圖片物件展開來，看哪個欄位有圖片，接著就會自動存進對應欄位了
                }).then((product) => {
                    return res.json({ status: "success" })
                })
            })
        } else {
            // 沒有的話就只新增文字或數字的那些欄位資料
            return Product.create({
                name: req.body.name,
                BrandId: req.body.brandId,
                listPrice: req.body.listPrice,
                sellingPrice: req.body.sellingPrice,
                inventory: req.body.inventory,
                sellingStatus: req.body.sellingStatus,
                shippingFee: req.body.shippingFee,
                Category1Id: req.body.category1Id,
                Category2Id: req.body.category2Id,
                Category3Id: req.body.category3Id,
            }).then((product) => {
                return res.json({ status: "success" })
            })
        }
    },
    getProduct: (req, res) => {
        Product.findByPk(req.params.productId).then((product) => {
            res.json({ product })
        })
    },
    updateProduct: (req, res) => {
        const { files } = req
        const filesNewPath = {}
        const results = []
        // 如果有檔案資料，就去把每一筆圖片存到upload資料夾
        if (Object.keys(files).length !== 0) {
            // files裡面是一包物件，所以需要跑物件迴圈把每一個圖片取出來做轉移
            for (let [key, value] of Object.entries(files)) {
                results.push(
                    fsPromises.readFile(value[0].path).then((data) => {
                        return fsPromises
                            .writeFile(`upload/${value[0].originalname}`, data)
                            .then(() => {
                                return (filesNewPath[
                                    key
                                ] = `${URL}/upload/${value[0].originalname}`) // 因為是前後端分離，前後端會是不同網址，所以要在資料庫存進完整的圖片網址路徑
                            })
                    })
                )
            }
            // 確定所有圖片都轉移至upload後才更新到資料庫
            return Promise.all(results).then(() => {
                Product.findByPk(req.params.productId).then((product) => {
                    product
                        .update({
                            name: req.body.name,
                            BrandId: req.body.brandId,
                            listPrice: req.body.listPrice,
                            sellingPrice: req.body.sellingPrice,
                            inventory: req.body.inventory,
                            sellingStatus: req.body.sellingStatus,
                            shippingFee: req.body.shippingFee,
                            Category1Id: req.body.category1Id,
                            Category2Id: req.body.category2Id,
                            Category3Id: req.body.category3Id,
                            ...filesNewPath, // 直接把前面準備好的圖片物件展開來，看哪個欄位有圖片，接著就會自動存進對應欄位了
                        })
                        .then((product) => {
                            return res.json({ status: "success" })
                        })
                })
            })
        } else {
            // 沒有的話就只更新文字或數字的那些欄位資料
            return Product.findByPk(req.params.productId).then((product) => {
                product
                    .update({
                        name: req.body.name,
                        BrandId: req.body.brandId,
                        listPrice: req.body.listPrice,
                        sellingPrice: req.body.sellingPrice,
                        inventory: req.body.inventory,
                        sellingStatus: req.body.sellingStatus,
                        shippingFee: req.body.shippingFee,
                        Category1Id: req.body.category1Id,
                        Category2Id: req.body.category2Id,
                        Category3Id: req.body.category3Id,
                    })
                    .then((product) => {
                        return res.json({ status: "success" })
                    })
            })
        }
    },
    getCategories: (req, res) => {
        // 把回傳的query取出來，判斷回傳的是大或中類id去撈對應的中或小類資料表
        const key = Object.keys(req.query)[0]
        if (key === "getCategory1s") {
            Category1.findAll().then((category1s) => {
                res.json({ category1s })
            })
        } else if (key === "category1Id") {
            Category2.findAll({ where: req.query }).then((category2s) => {
                res.json({ category2s })
            })
        } else if (key === "category2Id") {
            Category3.findAll({ where: req.query }).then((category3s) => {
                res.json({ category3s })
            })
        }
    },
    addCategory: (req, res) => {
        // 把回傳的query取出來，判斷是要新增大類或中類或小類
        const whichCategory = req.query.whichCategory
        if (whichCategory === "category1") {
            Category1.create({
                name: req.body.category1Name,
            }).then((category1) => {
                res.json({ status: "success", category1 })
            })
        } else if (whichCategory === "category2") {
            Category2.create({
                Category1Id: req.body.category1Id,
                name: req.body.category2Name,
            }).then((category2) => {
                res.json({ status: "success" })
            })
        } else if (whichCategory === "category3") {
            Category3.create({
                Category2Id: req.body.category2Id,
                name: req.body.category3Name,
            }).then((category3) => {
                res.json({ status: "success" })
            })
        }
    },
    updateCategory: (req, res) => {
        // 把回傳的query取出來，判斷是要編輯大類或中類或小類
        const whichCategory = req.query.whichCategory
        if (whichCategory === "category1") {
            Category1.findByPk(req.body.category1Id).then((category1) => {
                category1
                    .update({
                        name: req.body.category1Name,
                    })
                    .then((category1) => {
                        res.json({ status: "success", category1 })
                    })
            })
        } else if (whichCategory === "category2") {
            Category2.findByPk(req.body.category2Id).then((category2) => {
                category2
                    .update({
                        name: req.body.category2Name,
                    })
                    .then((category2) => {
                        res.json({ status: "success" })
                    })
            })
        } else if (whichCategory === "category3") {
            Category3.findByPk(req.body.category3Id).then((category3) => {
                category3
                    .update({
                        name: req.body.category3Name,
                    })
                    .then((category3) => {
                        res.json({ status: "success" })
                    })
            })
        }
    },
    deleteCategory: (req, res) => {
        // 把回傳的query取出來，判斷是要刪除大類或中類或小類
        const whichCategory = req.query.whichCategory
        console.log(req.query)
        if (whichCategory === "category1") {
            Category1.findByPk(req.query.categoryId).then((category1) => {
                category1.destroy().then((category1) => {
                    res.json({ status: "success" })
                })
            })
        } else if (whichCategory === "category2") {
            Category2.findByPk(req.query.categoryId).then((category2) => {
                category2.destroy().then((category2) => {
                    res.json({ status: "success" })
                })
            })
        } else if (whichCategory === "category3") {
            Category3.findByPk(req.query.categoryId).then((category3) => {
                category3.destroy().then((category3) => {
                    res.json({ status: "success" })
                })
            })
        }
    },
    getAllOrders: (req, res) => {
        Order.findAll({
            include: [{ model: User }, { model: OrderStatus }],
        }).then((orders) => {
            res.json({ orders })
        })
    },
    getAllBrands: (req, res) => {
        Brand.findAll({ include: [{ model: Product }] }).then((brands) => {
            res.json({ brands })
        })
    },
    addBrand: (req, res) => {
        if (req.body.brandName === "") {
            res.json({ status: "error", text: "您未輸入任何文字" })
        } else {
            Brand.create({
                name: req.body.brandName,
            }).then((brand) => {
                res.json({ status: "success", brand })
            })
        }
    },
    updateBrand: (req, res) => {
        Brand.findByPk(req.body.brandId).then((brand) => {
            brand
                .update({
                    name: req.body.brandName,
                })
                .then((brand) => {
                    res.json({ status: "success" })
                })
        })
    },
    deleteBrand: (req, res) => {
        Brand.findByPk(req.query.brandId).then((brand) => {
            brand.destroy().then((brand) => {
                res.json({ status: "success" })
            })
        })
    },
    updateOrderShipped: (req, res) => {
        Order.findByPk(req.params.orderId).then((order) => {
            // 判斷要修改的訂單狀態是不是已經在訂單處理中11，才去把他的訂單狀態(原本是寫2就好，但上了Heroku會跳號，所以要改成11)
            if (order.OrderStatusId === 11) {
                order
                    .update({
                        orderStatusId: 31, // 原本是寫4已出貨就好，但上了Heroku會跳號，所以要改成31
                    })
                    .then((order) => {
                        res.json({ status: "success" })
                    })
            }
        })
    },
}

module.exports = adminController
