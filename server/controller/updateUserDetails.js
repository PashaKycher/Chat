const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken")
const UserModel = require("../models/userModel")

async function updateUserDetails(req, res) {
    try {
        const token = req.cookies.token || ''
        const user = await getUserDetailsFromToken(token)
        const { name, email, password, profile_pic, city, phone, lastName } = req.body
        const updateUser = await UserModel.updateOne({ _id: user._id }, { name, email, password, profile_pic, city, phone, lastName })
        const userInformation = await UserModel.findById(user._id).select("-password")
        
        return res.status(200).json({
            message: "User details updated successfully",
            data: userInformation,
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong in updateUserDetails",
            error: true
        })
    }   
}

module.exports = updateUserDetails