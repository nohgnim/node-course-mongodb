const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs')

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
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
});

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'salt321').toString();

  //user.tokens.push({access, token});
  user.tokens = user.tokens.concat([{access, token}])

  return user.save().then(() => {
    return token;
  });
};

UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, 'salt321');
  } catch (e) {
    return Promise.reject()
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

//Hash password before save event
UserSchema.pre('save', function (next){
  var user = this

  //Only encrypt the password if it was modified
  if(user.isModified('password')){
    bcrypt.genSalt(10, (err, salt)=>{
      bcrypt.hash(user.password, salt, (err, hash) =>{
          user.password = hash
          next()
      })
    })
  }else{
    next()
  }
})

var User = mongoose.model('User', UserSchema);

module.exports = {User}


// const mongoose = require('mongoose')
// const validator = require('validator')
// const jwt = require('jsonwebtoken')
// const _ = require('lodash')

// let UserSchema = new mongoose.Schema(
//     {
//         email: {
//             type: String,
//             required: true,
//             trim: true,
//             minlength: 3,
//             unique: true,
//             validate: {
//                 validator: validator.isEmail,
//                 message: '{VALUE} is not a valid email.'
//             }
//         },
//         password: {
//             type: String,
//             required: true,
//             minlength: 6
//         },
//         tokens: [{
//             access: {
//                 type: String,
//                 required: true
//             },
//             token: {
//                 type: String,
//                 required: true
//             }
//         }]
//     })

// //Arrow functions do not bind 'this'
// UserSchema.methods.generateAuthToken = function(){
//     let user = this
//     let access = 'auth'
//     let token = jwt.sign({_id: user._id.toHexString(), access}, 'salt321').toString()

//     user.tokens = user.tokens.concat([{access, token}])

//     return user.save().then(() => {
//         return token
//     })
// }

// //Override method to limit what the app sends back to the user. Eliminates secure info.
// UserSchema.methods.toJSON = function(){
//     let user = this
//     let userObject = user.toObject()

//     return _.pick(userObject, ['_id', 'email'])
// }

// //Using statics to create a model method vs an instance method
// UserSchema.statics.findByToken = function (token){
//     let User = this
//     var decoded

//     try {
//         decoded = jwt.verify(token, 'salt321')
//     } catch(err) {
//         return Promise.reject()
//     }
//     console.log(decoded)
//     console.log(token)
//     return User.findOne({
//         '_id': decoded._id,
//         'tokens:token': token,
//         'tokens.access': 'auth'
//     })
// }

// let User = mongoose.model('User', UserSchema)

// module.exports = {User}