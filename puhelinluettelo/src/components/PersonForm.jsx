const PersonForm = ({addPerson, newName, newNumber, setNewName, setNewNumber }) => {
    return (
      <form onSubmit={addPerson}>
        <div>
          Name: 
          <input value={newName} onChange={({ target }) => setNewName(target.value)} />
        </div>
        <div>
          Number: 
          <input value={newNumber} onChange={({ target }) => setNewNumber(target.value)} />
          <p>Please use following formats: xx-xxxxxx or xxx-xxxxx</p>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
  }
  
  export default PersonForm