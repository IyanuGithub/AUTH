const Users = require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//headers, payload, id, signature
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: '3d'})
}

const handleErrors = (err) => {
    // err messages err codes - 11000
    let errors = { email: '', password: ''}
    if(err.code === 11000) {
        errors.email = 'Email is already in use'
        return errors
    }

    if (err.message === 'User not registered yet') {
        errors.email = 'This Email has not been registered'
        return errors
    }
    if(err.meassage === 'Invalid email or password') {
        errors.email = 'invalid Email or Password'
        errors.password = 'Invalid Email or password'
        return errors
    }
    if(err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message

        })
    }
    return errors
}

const register = async(req, res) => {
    const { email, password } = req.body
    try {
       
        //  create the user on the database
        const user = await Users.create({ email, password })
        res.status(201).json({ success: true, data: user })
    } catch (error) {
        const errors = handleErrors(error)
        res.status(400).json({success: false, errors})
        //handle errors in the catch block
        
    }
}


const login = async (req, res) => {
   const { email, password } = req.body
   try {
    if(!email || !password) {
        return res.status(400).json({success: false, msg: 'please provide necessary information'})
    }
    //email is registered
    const user = await Users.findOne({email})
    if (user) {
        const authenticated = await bcrypt.compare(password, user.password);
        if (authenticated) {
            //Token set
            const token =  generateToken(user._id)
            const time = 3 * 24 * 60 * 60 * 1000
            res.cookie('jwt', token, {maxAge: time})
            return res.status(200).json({success: true, data: user})
        }
        throw Error('Invalid email or password')

    }
    throw Error('User not registered yet')
   } catch (error) {
    const errors = handleErrors(error)
        res.status(400).json({success: false, errors})
    
   }
}

const logout = (req, res) => {
    res.cookie('jwt', ' ', { maxAge: 1000 })
    res.redirect('/login')
}

module.exports = { register, login, logout }