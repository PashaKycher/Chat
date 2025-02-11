const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken")


async function userDetails(req, res) {
    try {
        const token = req.cookies.token || ''
        const user = await getUserDetailsFromToken(token)
        
        return res.status(200).json({
            massage : "User details fetched successfully",
            data : user,

        })
        
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong in userDetails",
            error: true
        })
    }
}

module.exports = userDetails