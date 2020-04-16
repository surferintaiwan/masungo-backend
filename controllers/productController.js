const db = require('../models')
const Category1 = db.Category1

const productController = {
    getCategories: (req, res) => {
        Category1.findAll().then(category1s => {
            res.json({categories: category1s})
        }) 
    }
}

module.exports = productController