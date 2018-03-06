const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose')
//const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')

//let id = '5a99e940806fde1444b71ac6'
let userId = '5a98a71fd026da0ffe1bc08d'

//Validate id
if(!ObjectID.isValid(userId)){
    console.log('Id is not valid')
}

//Find all users returns an array of users
User.find({
    _id: userId
}).then((users) => {
    console.log('Users', users)
})

//Fine a user given the userId
User.findById(userId).then((user) => {
    if(!user){
        return console.log('User not found.')
    }
    console.log('User by id: ', JSON.stringify(user), 2)
}).catch((err) => {
    console.log(err)
})

// Todo.find({ //Returns an array
//     _id: id //Mongoose converts the string to object id
// }).then((todos) => {
//     console.log('Todos', todos)
// })

// Todo.findOne({ //Returns an object
//     _id: id //Mongoose converts the string to object id
// }).then((todo) => {
//     console.log('Todo', todo)
// })

// Todo.findById(id).then((todo) => {
//     if(!todo){
//         return console.log('Id not found.')
//     }
//     console.log('Todo by id: ', todo)
// }).catch((err) => {
//     console.log(err)
// })