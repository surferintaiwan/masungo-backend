const passport = require('passport')

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const db = require('../models')
const User = db.User

let jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.JWT_SECRET
passport.use(new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    User.findByPk(jwt_payload.id, {
        include: [
            {model: db.Order}
        ]
    }).then(user => {
        if (!user) return next(null, false)
        return next(null, user)
    })
}))

module.exports = passport