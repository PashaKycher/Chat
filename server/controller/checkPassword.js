const UserModel = require("../models/userModel")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")

async function checkPassword(req, res) {
    try {

        const { password, userId } = req.body
        const user = await UserModel.findById(userId)
        const varifyPassword = await bcryptjs.compare(password, user.password)
        if (!varifyPassword) {
            return res.status(400).json({
                message: "Wrong password",
                error: true
            })
        }

        const tokenData = {
            id : user._id,
            email : user.email
        }
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: "1d"})
        const cookieOptions = {
            http: true,
            secure: true,
        }

        return res.cookie("token", token, cookieOptions).status(200).json({
            message: "Password verify",
            success: true,
            token: token
        })
        
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong in checkPassword",
            error: true
        })
    }
}

module.exports = checkPassword