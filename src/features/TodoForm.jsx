import { useRef, useState } from "react"

function TodoForm({ onAddTodo }) {
  const inputRef = useRef(null)
  const [workingTodoTitle, setWorkingTodoTitle] = useState("")

  const handleAddTodo = (event) => {
    event.preventDefault()

    if (!workingTodoTitle.trim()) return

    onAddTodo(workingTodoTitle)
    setWorkingTodoTitle("")
    inputRef.current.focus()
  }
  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo</label>
      <input
        id="todoTitle"
        name="todoTitle"
        ref={inputRef}
        value={workingTodoTitle}
        onChange={(e) => setWorkingTodoTitle(e.target.value)}
      />
      <button type="submit" disabled={!workingTodoTitle.trim()}>
        Add Todo
      </button>
    </form>
  )
}

export default TodoForm
