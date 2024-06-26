const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give: node mongo.js <password> [<name>] [<number>]')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://saonerva:${password}@cluster0.2u9h7qw.mongodb.net/puhelinluetteloApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: 'Nancy T.',
  number: '0340123456',
})

person.save().then(result => {
  console.log('Person saved!')
  mongoose.connection.close()
})