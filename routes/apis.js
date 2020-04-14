const express = require('express')
const router = express.Router()
const db = require('../models')
const passport = require('../config/passport')
const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')

const authenticated = passport.authenticate('jwt', {session: false})
const authenticatedAdmin = (req, res, next) => {
    if (req.user) {
        if (req.user.isAdmin) {return next()}
        return res.json({status: 'error', message: '沒有讀取權限'})
    } else {
        return res.json({status: 'error', message: '沒有這個使用者'})
    }
}

// 註冊/登入
router.post('/signup', userController.signUp)
router.post('/signIn', userController.signIn)

// 前台
router.get('/index', authenticated, (req, res)=>{
    res.json('index')
})

// 後台
router.get('/admin/members', authenticated, authenticatedAdmin, adminController.getMembers)

module.exports = router