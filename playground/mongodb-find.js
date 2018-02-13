const {MongoClient, ObjectID} = require('mongodb')
const assert = require('assert');

const url = 'mongodb://localhost:27017';
const dbName = 'TodoApp';
(async function() {
  let client

  try {
    client = await MongoClient.connect(url)
    console.log("Connected correctly to server")

    const db = client.db(dbName)

    //Do some stuff
    let docs = await db.collection('Todos').find().toArray()
    console.log(docs)
    let completed = await db.collection('Todos').find({completed: true}).toArray()
    console.log(completed)
    let incomplete = await db.collection('Todos').find({completed: false}).toArray()
    console.log(`Incomplete Tasks: `)
    console.log(incomplete)
    let byObjId = await db.collection('Todos').find({
        _id: new ObjectID('5a8350aee60971e5f12b9ff3')
    }).toArray()
    console.log(byObjId)
    let countDocs = await db.collection('Todos').count()
    console.log('Number of todos: ' + countDocs)
    let findMike = await db.collection('Users').findOne({
    name: {$regex: /Mik.*/}
    })
    console.log('Find Mike: ' + findMike.name)
  } catch (err) {
    console.log(err.stack);
  }
  // Close connection
  client.close();
})();