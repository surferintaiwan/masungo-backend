const express = require("express")
const app = express()
const db = require("./models")
const bodyParser = require("body-parser")
const cors = require("cors")
// const session = require("express-session")

// app.use(
//     session({
//         secret: "your secret key", // secret: 定義一組屬於你的字串做為私鑰
//         resave: false,
//         saveUninitialized: true,
//     })
// )

app.use(cors())

// 使用環境變數儲存敏感訊息
if (process.env.NODE_env !== "production") {
    require("dotenv").config()
}

app.listen(3000, () => {
    db.sequelize.sync() //確認DB連線正常
    console.log("localhost:3000 is listenting")
})

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

require("./routes")(app)
