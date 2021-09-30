import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()
let _client;

const createClient = async () => {
  if(!_client){
    _client = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    await _client.connect()
  }
  return _client
}

const getUserCollection = async () => {
  const client = await createClient()
  const db = client.db(process.env.MONGODB_DB)
  return db.collection('users')

}

const createUser = async ({ firstName, lastName, email }) => {
  const userCollection = await getUserCollection()
  await userCollection.insertOne({ firstName, lastName, email })
  return { firstName, lastName, email }
}

const getUsers = async () => {
  const userCollection = await getUserCollection()
  const users = await userCollection.find()
  return users.toArray()
}

_client = await createClient()
createUser({ firstName: 'Todd', lastName: 'Albert', email: 'todd@bocacode.com' }).then(() => {
  getUsers().then(users => {
    console.log(users)
    _client.close().then()
  })
})