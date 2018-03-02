const express = require('express')
const bodyParser = require('body-parser')

let {mongoose} = require('./db/mongoose')
let {Todo} = require('./models/todo')
let {User} = require('./models/user')

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

app.listen(3000, () => {
    console.log('Started on port 3000.')
})

module.exports = {app}