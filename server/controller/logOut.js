async function logOut(req, res) {
    try {
        const cookieOptions = {
            http: true,
            secure: true,
        }

        return res.cookie("token", "", cookieOptions).status(200).json({
            message: "Log out successfully",
            success: true
        })
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong in logOut",
            error: true
        })
    }
}

module.exports = logOut