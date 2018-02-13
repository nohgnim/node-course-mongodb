// const MongoClient = require('mongodb').MongoClient;
//Generate your own objectid
const {MongoClient, ObjectID} = require('mongodb')
const assert = require('assert');

// let obj = new ObjectID()
// console.log(obj)

const url = 'mongodb://localhost:27017';
const dbName = 'TodoApp';

/** Ojbect Destructuring */
// var user = {name: 'Ming', age: 51}
// var {name} = user
// console.log(name)

// (async function() {
//   let client

// //   try {
// //     client = await MongoClient.connect(url)
// //     console.log("Connected correctly to server")

// //     const db = client.db(dbName)

// //     // Insert a single document
// //     let r = await db.collection('Todos').insertOne({
// //         text: 'Something to do',
// //         completed: false
// //     })
// //     console.log(JSON.stringify(r.ops, undefined, 2))
// //   } catch (err) {
// //     console.log(err.stack);
// //   }

//   try {
//     client = await MongoClient.connect(url)
//     console.log("Connected correctly to server")

//     const db = client.db(dbName)

//     // Insert a single document
//     let r = await db.collection('Users').insertOne({
//         name: 'Ming Hon',
//         age: 51,
//         location: 'Calgary, AB'
//     })
//     console.log(JSON.stringify(r.ops[0]._id.getTimestamp(), undefined, 2))
//   } catch (err) {
//     console.log(err.stack);
//   }
//   // Close connection
//   client.close();
// })();

// //Create mongo client
// const MongoClient = require('mongodb').MongoClient

// MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
//     if(err) {
//         return console.log('Unable to connect to MongoDb Server.')
//     }
//     console.log('Connected to MongoDb Server')

//     db.collection('Todos').insertOne({
//         text: 'Something to do',
//         completed: false
//     }, (err, result)=>{
//         if(err){
//             return console.log('Unable to insert todo: ' + err)
//         }
//         console.log(JSON.stringify(result.ops, undefined, 2))
//     })

//     db.close()
// })