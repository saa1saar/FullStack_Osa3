const express = require('express')
var morgan = require('morgan')
require("dotenv").config()
const Person = require('./models/person')

const app = express()
const cors = require('cors')

app.use(express.json())
app.use(express.static('dist'))

app.use(morgan('combined'))
morgan.token('request-body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request-body'))

app.use(cors())
app.use(express.static('public'))


/*let persons = [
    { 
    "name": "Arto Hellas", 
    "number": "040-123456",
    "id": "1"
    },
    { 
    "name": "Ada Lovelace", 
    "number": "39-44-5323523",
    "id": "2"
    },
    { 
    "name": "Dan Abramov", 
    "number": "12-43-234345",
    "id": "3"
    },
    { 
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122",
    "id": "4"
    },
    { 
    "name": "Salli Saarinen", 
    "number": "044-123-4567",
    "id": "5"
    } 
      
]*/
app.get('/', function (request, response) {
response.send('hello, world!')
  })
  
app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
  response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  
  if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.get('/info', (request, response) => {
  const kaikki = persons.length

  response.send(
      `<p>Puhelinnluettelossa on ${kaikki} yhteistietoa!</p>`+
      `<p>${new Date()}</p>`
  )
}

  )
// The post functionality
app.post('/api/persons', (request, response) => {
  const {name, number} = request.body

  if (!name || !number) {
    return response.status(400).json({ 
      error: 'Nimi ja/tai numero puuttuvat' 
    }).end()
  }
  
  const person = {
    name,
    number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.status(201).send(persons)
})

//The delete funcionality
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})