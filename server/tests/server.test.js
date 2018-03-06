const request = require('supertest')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')
const {ObjectId} = require('mongodb')

const todos = [{
    _id: new ObjectId(),
    text: 'First todo'
}, {
    _id: new ObjectId(),
    text: 'Second todo'
}]

//Deletes all the records out of the database each time the test runs
//Insert 2 test todos
beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => done())
})

test('Should create a new todo', (done)=>{
    let text = 'Poop'

    request(app)
        .post('/todos')
        .send({text}) //Send in request parameters as object
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text)
        })
        .end((err, res) => {
            if(err){
                return done(err)
            }

            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1)
                expect(todos[0].text).toBe(text)
                done()
            }).catch((e) => done(e))
        })
})

test('Should not create a todo with invalid body data', (done)=>{
    //Make request passing in app
    request(app)
        .post('/todos')
        .send() //pass in invalid empty request
        .expect(400)
        .end((err, res) => {
            if(err){
                return done(err)
            }

            Todo.find().then((todos) => {
                expect(todos.length).toBe(2)
                done()
            }).catch((e) => done(e))
        })
})

test('Should get all todos', (done)=>{
    //Make request passing in app
    request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(2)
        })
        .end(done)
})

test('Should return todo document', (done)=>{
    request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text)
        })
        .end(done)
})

test('Should return 404 if todo not found', (done)=>{
    request(app)
        .get(`/todos/${new ObjectId().toHexString()}`)
        .expect(404)
        .end(done)
})

test('Should return 404 if not an object id', (done)=>{
    request(app)
        .get(`/todos/1234`)
        .expect(404)
        .end(done)
})