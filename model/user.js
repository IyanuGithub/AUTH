// email - string, unique, required, validate
// password- string, required, minlength
const mongoose = require("mongoose")
const Schema = mongoose.Schema
const{ isEmail } = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new Schema ({

    email:{
        type: String,
        required: [true, 'please provide an email'],
        unique: [true, 'This email has been registered'],
        validate: [isEmail, 'please enter a valid email']
    },
    password:{
        type: String,
        requires: [true,'please provide a password'],
        minlength: [10, 'The minimum password length is 10']
    }

},{timestamps: true})


// mongoose hooks
 // function that protect user info before we save
 //generate salt, hash using salt
userSchema.pre('save', async function (next){
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()

})

module.exports = mongoose.model('User', userSchema)