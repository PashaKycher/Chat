const express = require('express')
const cors = require('cors')
const connectDB = require('./config/connectDB')
const router = require('./routes/index')
const cookiesParser = require('cookie-parser')
const {app, server} = require('./socket/index')
require('dotenv').config()

// const app = express()

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(express.json())
app.use(cookiesParser())

const PORT = process.env.PORT || 8080

app.get('/', (req,res) =>{
    res.json({
        message : "Server renning at : "+ PORT
    })
})

//api endpoints
app.use('/api', router)

connectDB().then(()=>{
    server.listen(PORT, ()=>{
        console.log("server running at : ", PORT)
    })
})


