const express = require('express')
var morgan = require('morgan')
require('dotenv').config()
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
    response.json(person)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

/*const generateId = () => {
  const maxId = person.length > 0
    ? Math.max(...person.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}*/

app.get('/info', (request, response, next) => {
  Person
    .countDocuments({})
    .then(count => {
      response.send(
        `<p>Phonebook has info for ${count} people.</p> <p>${new Date()}</p> `
      )
    })
    .catch(error => next(error))
})
// The post functionality
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }
  if (body.number === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)})
    .catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  Person
    .findByIdAndUpdate(request.params.id, body, { new: true, runValidators: true, context: 'query' })
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

//The delete funcionality
app.delete('/api/persons/:id', (request, response, next) => {

  Person
    .findByIdAndDelete(request.params.id)
    .then(person => {
      if (person) {
        response.status(204).end()
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)

  const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }

    next(error)
  }

  app.use(errorHandler)
})