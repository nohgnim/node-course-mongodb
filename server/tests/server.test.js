const request = require('supertest')

const {app} = require('./../server')
const {Todo} = require('./../models/todo')
const {User} = require('./../models/user')
const {ObjectId} = require('mongodb')
const {todos, populateTodos, users, populateUsers} = require('./seed/seed')

//Deletes all the records out of the database each time the test runs
//Insert 2 test todos
beforeEach(populateUsers)
beforeEach(populateTodos)

describe('GET todos', ()=>{
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
                    expect(todos.length).toBe(4)
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
                expect(res.body.todos.length).toBe(4)
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
})

describe('Delete todos/:id', ()=>{
    //Test delete route
    test('Should return 404 if not an object id', (done)=>{
        request(app)
            .delete(`/todos/1234`)
            .expect(404)
            .end(done)
    })

    test('Should return 404 if todo not found', (done)=>{
        request(app)
            .delete(`/todos/${new ObjectId().toHexString()}`)
            .expect(404)
            .end(done)
    })

    test('Should delete one todo', (done)=>{
        //Make request passing in app
        let hexId = todos[0]._id.toHexString()
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId)
            })
            .end((err, res)=>{
                if(err){
                    return done(err)
                }
                //Query db to try to find the item, it should return null
                Todo.findById(hexId).then((todos)=>{
                    expect(todos).toBeNull()
                    done()
                }).catch((err)=>{
                    done(err)
                })
            })
    })
})

describe('PATCH /todos/:id', ()=>{
    //Should update the todo
    test('Should update todo', (done) => {
        //Grab id of third item
        let hexId = todos[2]._id.toHexString()
        
        //Update the text, set completed to true
        //Verify response body = text sent, completed is true, completedAt is a number
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                text: 'Update my todo',
                completed: true
            })
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe('Update my todo')
                expect(res.body.todo.completed).toBe(true)
                expect(res.body.todo.completedAt).toBeGreaterThan(0)
            })
            .end(done)
    })

    //Should clear completedAt when todo is not completed
    test('Should clear completedAt when todo is not completed', (done) => {
        //Grab id of fourth todo item
        let hexId = todos[3]._id.toHexString()

        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: false,
                text: 'Updated todo'
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(false)
                expect(res.body.todo.completedAt).toBe(null)
            })
            .end(done)
        //Set completed to false
        //200
        //Verify response body, completed is false, completedAt is null
    })
})

describe('GET /users/me', () =>{
    test('Should return user if authenticated', (done)=>{
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res)=>{
                expect(res.body._id).toBe(users[0]._id.toHexString())
                expect(res.body.email).toBe(users[0].email)
            })
            .end(done)
    })
    test('Should return 401 if not authenticated', (done)=>{
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res)=>{
                expect(res.body).toEqual({})
            })
            .end(done)
        //body should be an empty object
        //Comparing 2 objects, must use toEqual NOT toBe!
    })
})

describe('POST /users', ()=>{
    test('Should create a user', (done)=>{
        let email = 'me@mail.com'
        let password = 'pass123'
        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res)=>{
                expect(res.headers['x-auth'].length).toBeDefined()
                expect(res.body._id).toBeDefined()
                expect(res.body.email).toBe(email)
            })
            .end((err) =>{
                if(err){
                    return done(err)
                }

                User.findOne({email}).then((user)=> {
                    expect(user).toBeDefined()
                    expect(user.password).not.toBe(password)
                    done()
                })
            })
    })
    test('Should return validation errors if request is invalid', (done)=>{
        //Send invalid email expect 400
        let email = 'blah'
        let password = 'validpassword'
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)

        //Send invalid password
        let email2 = 'ed@mail.com'
        let password2 = '123'
        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done)
    })
    test('Should not create user if email in use', (done) => {
        //Send existing email expect 400
        let email = users[0].email
        let password = 'pass123'

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
        done()
    })
})