const UserModel = require("../models/userModel")
const bcryptjs = require("bcryptjs")

async function registerUser(req,res) {
  try {
    const { name, email, password, profile_pic, city, phone, lastName } = req.body
    
    // Does the User exist?
    const checkEmail = await UserModel.findOne({email}) // will return either the User or NULL
    if (checkEmail){
      return res.status(400).json({
             message : "User already exits",
             error : true
        })
    }

    //password into hashpassword
    const salt = await bcryptjs.genSalt(10)
    const hashpassword = await bcryptjs.hash(password, salt) 

    //create a User
    const payload = {
        name,
        email,
        password : hashpassword,
        profile_pic,
        city,
        phone,
        lastName 
    }
    const user = new UserModel(payload)
    const userSave = await user.save()

    //response
    return res.status(201).json({
        message : "User created successfully",
        data : userSave,
        success : true
    })
  } catch (error) {
      return res.status(500).json({
             message : error.message || error,
             error : true
        })
  }
}

module.exports = registerUser