const express = require('express')
const bodyParser = require('body-parser')
const {ObjectID} = require('mongodb')

let {mongoose} = require('./db/mongoose')
let {Todo} = require('./models/todo')
let {User} = require('./models/user')

const port = process.env.PORT || 3000

let app = express()

//Extracts the entire body portion of incoming requests and exposes it via req.body
app.use(bodyParser.json())

//Set up route
app.post('/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    })
    todo.save().then((doc)=>{
        res.send(doc)
    }, (err) => {
        res.status(400).send(err)
    })
})

app.get('/todos', (req,res) => {
    Todo.find().then((todos) => {
        res.send({todos})
    }), (err) => {
        res.status(400).send(err)
    }
})

app.get('/todos/:id', (req, res) => {
    let id = req.params.id
    if(!ObjectID.isValid(id)){
        res.status(404).send()
        return console.log('Id is not valid')
    }
    Todo.findById(id).then((todo) => {
        if(!todo){
            res.status(404).send()
            return console.log('Id not found.')
        }
        res.status(200).send({todo})
    }).catch((err) => {
        res.status(400).send()
    })
}), (err) => {
    res.status(400).send(err)
}

app.listen(port, () => {
    console.log(`Started on port ${port}.`)
})

module.exports = {app}