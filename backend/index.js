require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

app.use(express.static('dist'))
app.use(express.json())
morgan.token('data', function (req, res) {return req.method === 'POST' ? JSON.stringify(req.body) : '' })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get('/', (request, response) => {
	response.send('<h1>PhoneBooks</h1>')
})
 
app.get('/api/info', (request, response, next) => {
	Person.countDocuments({})
		.then(count => {
			const date = new Date()
			response.send(`<p>Phonebook has info for ${count} people</p><p>${date}</p>`)
		})
		.catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
	Person.find({})
		.then(persons => {
			response.json(persons)
		})
		.catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  	.then(person => {
			if (person) {
				response.json(person)
			} else {
				response.status(404).end()
			}
  	})
		.catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndDelete(request.params.id)
		.then(result => {
			console.log('deletion successful')
			response.status(204).end()
		})
		.catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
	const name = request.body.name
	const number = request.body.number

	if (!name || !number) {
		return response.status(400).json({ error: 'Name or number missing' })
	}

	// if (phoneNumbers.some(person => person.name === name)) {
	// 	return response.status(400).json({ error: 'name must be unique' })
	// }

	const person = new Person({
		name: name,
		number: number,
	})
	
	person.save()
		.then(newPerson => {
			response.json(newPerson)
		})
		.catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
	const newNumber = request.body.number

	Person.findById(request.params.id)
		.then(person => {
			if (!person) {
				return response.status(404).end()
			}

			person.number = newNumber

			return person.save().then((updatedPerson) => {
				response.json(updatedPerson)
			})
		})
		.catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

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

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})