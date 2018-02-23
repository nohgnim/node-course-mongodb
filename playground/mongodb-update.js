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

    //Find one and update
    let myUpdate = await db.collection('Todos').findOneAndUpdate({_id: new ObjectID("5a90729536da4296af8f1930")},
        {$set: 
            {completed: true}
        },
        {returnOriginal: false}
    )
    console.log(myUpdate)

    //Update user name and age
    let updateUser = await db.collection('Users').findOneAndUpdate({
        _id: new ObjectID("5a832c79636f43084ac74aa8")
    }, {$set:
        {name: 'Robert T Builder'},
        $inc: {age: 2}},
    {returnOriginal: false}
    )
    console.log(updateUser)

  } catch (err) {
    console.log(err.stack);
  }
  // Close connection
  client.close();
})();