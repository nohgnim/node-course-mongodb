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

    //Delete Many
    //let deleteMany = await db.collection('Todos').deleteMany({text: 'Eat lunch'})
    //console.log(deleteMany)

    //Delete One
    // let deleteOne = await db.collection('Todos').deleteOne({text: 'Eat lunch'})
    // console.log(deleteOne)

    //Find one and delete. Returns the object
    // let findOneAndDelete = await db.collection('Todos').findOneAndDelete({completed: false})
    // console.log(findOneAndDelete)

    let deleteMany = await db.collection('Users').deleteMany({name: 'Alice Cooper'})
    console.log(deleteMany)

    let findOneAndDelete = await db.collection('Users').findOneAndDelete({_id: new ObjectID("5a834e056a1d9d092d24ba55")})
    console.log(findOneAndDelete)

  } catch (err) {
    console.log(err.stack);
  }
  // Close connection
  client.close();
})();