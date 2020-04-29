const express = require("express")
const app = express()
const db = require("./models")
const bodyParser = require("body-parser")
const cors = require("cors")

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cors())
// 讓外界使用upload資料夾
app.use("/upload", express.static(__dirname + "/upload"))

// 使用環境變數儲存敏感訊息
if (process.env.NODE_env !== "production") {
    require("dotenv").config()
}

app.listen(3000, () => {
    db.sequelize.sync() //確認DB連線正常
    console.log("localhost:3000 is listenting")
})

// app.use(express.json())

require("./routes")(app)
