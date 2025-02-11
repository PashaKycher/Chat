const mongoose = require('mongoose')

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)

        const connection = mongoose.connection
        connection.on('connected',()=>{
            console.log("Connect to DB")
        })
        connection.on('error',()=>{
            console.error("Something is wrong in mongodb 'connectDB' : ", error)
        })
    } catch (error) {
        console.error("connectDB error : ", error)
    }
}

module.exports = connectDB