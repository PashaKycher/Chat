const bcryptjs = require("bcryptjs")
const UserModel = require("../models/userModel")

async function forgotPassword(req, res) {
    try {
        //password into hashpassword
        const password = '456789'
        const salt = await bcryptjs.genSalt(10)
        const hashpassword = await bcryptjs.hash(password, salt) 
        // get user
        const { userId } = req.body
        // chenge password
        const updateUser = await UserModel.updateOne({ _id: userId }, { password: hashpassword })
        const userInformation = await UserModel.findById(userId).select("-password")

        return res.status(200).json({
            message: "User details updated successfully",
            data: userInformation,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong in forgotPassword",
            error: true
        })
    }
}

module.exports = forgotPassword