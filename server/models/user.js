const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

let UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            unique: true,
            validate: {
                validator: validator.isEmail,
                message: '{VALUE} is not a valid email.'
            }
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        tokens: [{
            access: {
                type: String,
                required: true
            },
            token: {
                type: String,
                required: true
            }
        }]
    })

//Arrow functions do not bind 'this'
UserSchema.methods.generateAuthToken = function(){
    let user = this
    let access = 'auth'
    let token = jwt.sign({_id: user._id.toHexString(), access}, 'salt321').toString()

    user.tokens = user.tokens.concat([{access, token}])

    return user.save().then(() => {
        return token
    })
}

//Override method to limit what the app sends back to the user. Eliminates secure info.
UserSchema.methods.toJSON = function(){
    let user = this
    let userObject = user.toObject()

    return _.pick(userObject, ['_id', 'email'])
}

let User = mongoose.model('User', UserSchema)

module.exports = {User}