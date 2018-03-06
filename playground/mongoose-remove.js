const {ObjectID} = require('mongodb')

const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')

//Removes all todos from the todos table
// Todo.remove({}).then((result)=>{
//     console.log(result)
// })

//Find one and remove takes a query as a parameter
Todo.findOneAndRemove({_id:'5a9ecb063327b241e2de4e36'}).then((todo) => {

})

//Remove by id
Todo.findByIdAndRemove('5a9ecb063327b241e2de4e36').then((todo)=> {
    console.log(todo)
})