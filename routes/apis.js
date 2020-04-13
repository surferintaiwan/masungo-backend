const express = require('express')
const router = express.Router()

router.get('/index', (req, res)=>{
    res.send('首頁API')
})

module.exports = router