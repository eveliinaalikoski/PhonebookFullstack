import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import phoneService from './services/phone'
import Notification from './components/Notification'
import ErrorMessage from './components/ErrorMessage'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    phoneService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const handleAddPerson = (event) => {
    event.preventDefault()
    const alreadyPerson = persons.find(person => person.name === newName)
    console.log(alreadyPerson)
    if (alreadyPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = {...alreadyPerson, number: newNumber}
        phoneService
          .update(alreadyPerson.id, updatedPerson)
            .then(response => {
              setPersons(persons.map(person => person.id !== alreadyPerson.id ? person : response.data))
              setMessage(`Updated ${newName}'s number`)
              setTimeout(() => {
                setMessage(null)
              }, 3000)
            })
          .catch(error => {
            setErrorMessage(`Information of ${newName} has already been removed from server`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 3000)
          })
        }
      setNewName('')
      setNewNumber('')
    } else {
      const newPerson = {name: newName, number: newNumber, id: String(persons.length + 1)}
      console.log(newPerson)
      
      phoneService
        .create(newPerson)
        .then( response => {
          setPersons(persons.concat(response.data))
          setMessage(`Added ${newName}`)
          setTimeout(() => {
            setMessage(null)
          }, 3000)
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const handleDeletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}`)) {
      phoneService
        .deletetion(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          console.log("deleted " + name)
        })
      setMessage(`Deleted ${name}`)
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const peopleToShow = filter
    ? persons.filter((person) =>
      person.name.toLowerCase().includes(filter.toLowerCase())
      )
    : persons


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <ErrorMessage message={errorMessage} />
      <Filter value={filter} onChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm 
        onSubmit={handleAddPerson}
        newName={newName}
        onNameChange={handleNameChange}
        newNumber={newNumber}
        onNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons 
        persons={peopleToShow}
        onDeletion={handleDeletePerson}
      />
    </div>
  )
}

export default App