import { useRef, useState } from "react"
import TextInputWithLabel from "../../shared/TextInputWithLabel.jsx"
import { isValidTodoTitle } from "../../utils/todoValidation.js"

function TodoForm({ onAddTodo }) {
  const inputRef = useRef(null)
  const [workingTodoTitle, setWorkingTodoTitle] = useState("")

  const handleAddTodo = (event) => {
    event.preventDefault()

    if (!workingTodoTitle.trim()) return

    onAddTodo(workingTodoTitle)
    setWorkingTodoTitle("")
    inputRef.current?.focus()
  }
  return (
    <form onSubmit={handleAddTodo}>
      <TextInputWithLabel
        elementId="todoTitle"
        labelText="Todo"
        inputRef={inputRef}
        value={workingTodoTitle}
        onChange={(e) => setWorkingTodoTitle(e.target.value)}
      />

      <button type="submit" disabled={!isValidTodoTitle(workingTodoTitle)}>
        Add Todo
      </button>
    </form>
  )
}

export default TodoForm
