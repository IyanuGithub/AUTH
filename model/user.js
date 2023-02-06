// email - string, unique, required, validate
// password- string, required, minlength
const mongoose = require("mongoose")
const Schema = mongoose.Schema
const{ isEmail } = require('validator')

const userSchema = new Schema ({

    email:{
        type: String,
        required: [true, 'please provide an email'],
        unique: [true, 'This email has been registered'],
        validate: [()=>{}, 'please enter a valid email']
    },
    password:{
        type: String,
        requires: [true,'please provide a password'],
        minlength: [10, 'The minimum password length is 10']
    }

},{timestamps: true})

module.exports = mongoose.model('User', userSchema)