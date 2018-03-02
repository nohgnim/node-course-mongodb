const request = require('supertest')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')

//Deletes all the records out of the database each time the test runs
beforeEach((done) => {
    Todo.remove({}).then(() => done ())
})

test('Should create a new todo', (done)=>{
    let text = 'Poop'

    request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) => {
            expect(res.body.text).toBe(text)
        })
        .end((err, res) => {
            if(err){
                return done(err)
            }

            Todo.find().then((todos) => {
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
                expect(todos.length).toBe(0)
                done()
            }).catch((e) => done(e))
        })
})