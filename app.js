const express = require('express')
const app = express()
const db = require('./models')

app.listen(3000, ()=>{
    db.sequelize.sync() //確認DB連線正常
    console.log('localhost:3000 is listenting')
})

require('./routes')(app)