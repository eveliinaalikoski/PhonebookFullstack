const Persons = ({ persons, onDeletion }) => {
    return (
        persons.map(person => (
            <Person key={person.id} person={person} onDeletion={onDeletion} />
        ))
    )
}

const Person = ({person, onDeletion}) => {
    return (
      <p>
        {person.name} {person.number} 
        <button onClick={() => onDeletion(person.id, person.name)}>Delete</button>
      </p>
    )}

export default Persons