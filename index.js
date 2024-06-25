const express = require('express')
const app = express()

app.use(express.json())

let persons = [
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
      
]
  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/persons', (request, response) => {
    response.json(persons)
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
  
    response.json(person)
  })
  //The delete funcionality
  app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })
  
  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })