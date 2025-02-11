const express = require('express')
const router = express.Router()
const registerUser = require('../controller/registerUser')
const checkEmail = require('../controller/checkEmail')
const checkPassword = require('../controller/checkPassword')
const userDetails = require('../controller/userDetails')
const logOut = require('../controller/logOut')
const updateUserDetails = require('../controller/updateUserDetails')
const searchUser = require('../controller/searchUser')
const forgotPassword = require('../controller/forgotPassword')

//create user api
router.post('/register', registerUser)

//check user email
router.post('/email', checkEmail)

//check user password
router.post('/password', checkPassword)

//login user details
router.get('/user-details', userDetails)

//log out user
router.get('/logout', logOut)

//update user details
router.post('/update-user', updateUserDetails)

//search user
router.post('/search-user', searchUser)

//search user
router.post('/forgot-password', forgotPassword)

module.exports = router