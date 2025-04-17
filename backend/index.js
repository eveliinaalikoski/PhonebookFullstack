const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
morgan.token('data', function (req, res) {return req.method === 'POST' ? JSON.stringify(req.body) : '' })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));

let phoneNumbers = [
    {
        id: "1",
        name: "Matti",
        number: "050"
    },
    {
        id: "2",
        name: "Maija",
        number: "040"
    },
    {
        id: "3",
        name: "Minja",
        number: "044"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>PhoneBooks</h1>')
  })
 
app.get('/api/info', (request, response) => {
    const count = phoneNumbers.length
    const date = new Date()
    response.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`)
  })
 
app.get('/api/persons', (request, response) => {
    response.json(phoneNumbers)
  })

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = phoneNumbers.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    phoneNumbers = phoneNumbers.filter(persons => persons.id !== id);
    response.status(204).end()
  })

app.post('/api/persons', (request, response) => {
    const id = Math.floor(Math.random() * 10000).toString()
    const name = request.body.name
    const number = request.body.number

    if (!name || !number) {
        return response.status(400).json({ error: 'Name or number missing' })
    }

    if (phoneNumbers.some(person => person.name === name)) {
        return response.status(400).json({ error: 'name must be unique' })
    }

    const person = {
        id: id,
        name: name,
        number: number
    }
    phoneNumbers = phoneNumbers.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})