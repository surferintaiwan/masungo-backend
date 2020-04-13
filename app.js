const express = require('express')
const app = express()

app.listen(3000, ()=>{
    console.log('localhost:3000 is listenting')
})

require('./routes')(app)