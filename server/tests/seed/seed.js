const {Todo} = require('./../../models/todo')
const jwt = require('jsonwebtoken')
const {ObjectId} = require('mongodb')
const {User} = require('./../../models/user')

//Seed data
const userOneId = new ObjectId()
const userTwoId = new ObjectId()
const users = [{
    _id: userOneId,
    email: 'fred@flintstone.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'salt321').toString()
    }]
},{
    _id: userTwoId,
    email: 'wilma@flintstone.com',
    password: 'userTwoPass'
}]

const todos = [{
    _id: new ObjectId(),
    text: 'First todo'
}, {
    _id: new ObjectId(),
    text: 'Second todo',
    completed: true,
    CompletedAt: 8910
}, {
    _id: new ObjectId(),
    text: 'Third todo',
    completed: false,
    CompletedAt: null
}, {
    _id: new ObjectId(),
    text: 'Fourth todo',
    completed: true,
    CompletedAt: 879887
}]

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => done())
}

const populateUsers = (done) =>{
    User.remove({}).then(()=>{
        let userOne = new User(users[0]).save()
        let userTwo = new User(users[1]).save()

        Promise.all([userOne, userTwo])
    }).then(()=> done())
}
module.exports = {todos, populateTodos, users, populateUsers}