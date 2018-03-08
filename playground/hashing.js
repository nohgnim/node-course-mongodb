//const {SHA256} = require('crypto-js')

//From jwt.io
const jwt = require('jsonwebtoken')

let data = {
    id: 10
}

//Takes json object and signs it by creating a salted hash then returns a token value
let token = jwt.sign(data, 'salt123')
console.log(token)

//Takes the token then ensures it was not manipulated
let decoded = jwt.verify(token, 'salt123')
console.log(decoded)

// let message = 'I am a penguin 345'
// let hash = SHA256(message).toString()

// console.log(`Message: ${message} : ${hash}`)

// let data = {
//     id: 4
// }

// //Create a token with the data then salt and hash the data
// let token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'some string to salt the data').toString()
// }

// let resultHash = SHA256(JSON.stringify(token.data) + 'some string to salt the data').toString()

// //Try to manipulate the hash to test the security of the hash + salt
// token.data.id = 5
// token.hash = SHA256(JSON.stringify(token.data)).toString()

// if(resultHash === token.hash){
//     console.log('Data was not changed')
// }else{
//     console.log('Data was changed. Do not trust!')
// }