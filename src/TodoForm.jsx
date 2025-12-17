import { useState } from "react"

function TodoForm({ todoList, setTodoList }) {
  const [title, setTitle] = useState("")

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      return
    }

    const nextId =
      todoList.length === 0
        ? 1
        : Math.max(...todoList.map((todo) => todo.id)) + 1

    setTodoList([...todoList, { id: nextId, title: trimmedTitle }])
    setTitle("")
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="todoTitle">Todo</label>
      <input
        id="title"
        name="title"
        placeholder="Add a todo"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <button type="submit">Add Todo</button>
    </form>
  )
}

export default TodoForm
