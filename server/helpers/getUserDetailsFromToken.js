const UserModel = require("../models/userModel")
const jwt = require("jsonwebtoken")

const getUserDetailsFromToken = async(token) => {
    if(!token){
        return {
            message : "Session out",
            logout: true
        }
    }

    const decode = await jwt.verify(token, process.env.JWT_SECRET)
    const user = await UserModel.findById(token).select("-password")
    return user
}

module.exports = getUserDetailsFromToken