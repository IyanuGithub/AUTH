const User = require('../model/user')
const bcrypt = require('bcrypt')
const { response } = require('express')

//error handling
//integrate views
// authentication - jsonwebtoken

const register = async (req, res) => {
    const { email, password } = req.body
// make sure that they provide email and password
    if(!email || !password) {
        return res.status(200).json({success: false, msg: 'please provide neccesary infomation'})
    }
    //email has not been registered
    const userExist = await User.findOne({ email})
    if(userExist) {
        return res.status(400).json({success: false, msg: 'email is already in use'})
    }
    //protect user info- hashing algorithms
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)
    // create the user
    try {
        const user = await User.create({email, password: hashedPassword})
        res.status(201).json({success: true, data: user})

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: error})
        
    }
}
   //email and password
const login = async (req, res) => {
    const { email, password } = req.body
    if(!email || !password) {
        return res.status(200).json({success: false, msg: 'please provide neccesary infomation'})
    }
    

    // user has registered
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(400).json({ success: false, msg: 'email not found, please Go and sign up'})
    }
    // provide the CORRECT details, email and password
    const authenticated = user.email === email && (await bcrypt.compare(password, user.password))

    if(authenticated) {
        user.password = ''
        return res.status(200).json({success: true, data: user})
    }else{
        return res.status(401).json({success: false, msg: 'Invalid email or password'})
    }
}

module.exports = { register, login, }