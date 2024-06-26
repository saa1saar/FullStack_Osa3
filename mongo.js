const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('Kirjaa: node mongo.js <password> [<nimi>] [<numero>]')
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
  name: process.argv[3],
  number: process.argv[4]
})

if (process.argv.length === 5) {
    person.save().then(result => {
        console.log(`${result.name} lisättiin numerolla: ${result.number} puhelinluetteloon!`)
        mongoose.connection.close()
    })
} else if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('Puhelinluettelo:')
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}