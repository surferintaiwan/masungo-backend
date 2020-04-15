const express = require('express')
const app = express()
const db = require('./models')
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(cors())

// 使用環境變數儲存敏感訊息
if (process.env.NODE_env !== 'production') {
    require('dotenv').config()
}

app.listen(3000, ()=>{
    db.sequelize.sync() //確認DB連線正常
    console.log('localhost:3000 is listenting')
})

app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))

require('./routes')(app)