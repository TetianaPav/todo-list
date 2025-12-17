import { useRef } from "react"

function TodoForm({ onAddTodo }) {
  const inputRef = useRef(null)

  const handleAddTodo = (event) => {
    event.preventDefault()

    const todoTitle = event.target.todoTitle.value.trim()
    if (!todoTitle) return

    onAddTodo(todoTitle)
    event.target.reset()
    inputRef.current.focus()
  }
  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo</label>
      <input id="todoTitle" name="todoTitle" ref={inputRef} required />
      <button type="submit">Add Todo</button>
    </form>
  )
}

export default TodoForm
