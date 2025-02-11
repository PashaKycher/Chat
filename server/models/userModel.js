const mongoose = require('mongoose')

// User schema (data of user)
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "provida name"]
    },
    email : {
        type : String,
        required : [true, "provide email"],
        unique : true
    },
    password : {
        type : String,
        required : [true, "provida password"]
    },
    profile_pic : {
        type : String,
        default : ""
    },
    city : {
        type : String,
        default : ""
    },
    phone : {
        type : String,
        default : ""
    },
    lastName : {
        type : String,
        default : ""
    },
}, {
    timestamps : true
})

const UserModel = mongoose.model('User', userSchema)
module.exports = UserModel