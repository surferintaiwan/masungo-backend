const fs = require("fs")
const fsPromises = fs.promises
const db = require("../models")
const User = db.User
const Product = db.Product
const Brand = db.Brand
const Category1 = db.Category1
const Category2 = db.Category2
const Category3 = db.Category3
const URL = process.env.URL
const adminController = {
    getAllMembers: (req, res) => {
        User.findAll().then((users) => {
            const filterUsers = {
                ...users.dataValues,
            }
        })
    },
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
            // 確定所有圖片都轉移至upload後才新增到資料庫
            return Promise.all(results).then(() => {
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
}

module.exports = adminController
