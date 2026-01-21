import { useEffect, useState } from "react"
import TodoForm from "./TodoForm.jsx"
import TodoList from "./TodoList/TodoList.jsx"

const baseUrl = import.meta.env.VITE_BASE_URL

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([])
  const [error, setError] = useState("")
  const [isTodoListLoading, setIsTodoListLoading] = useState(false)

  useEffect(() => {
    if (!token) return

    const fetchTodos = async () => {
      try {
        setError("")
        setIsTodoListLoading(true)

        const response = await fetch(`${baseUrl}/tasks`, {
          method: "GET",
          headers: {
            "X-CSRF-TOKEN": token,
          },
          credentials: "include",
        })

        if (response.status === 401) {
          throw new Error("unauthorized")
        }

        if (!response.ok) {
          throw new Error(`request failed: ${response.status}`)
        }

        const data = await response.json()
        setTodoList(data)
      } catch (err) {
        setError(`Error: ${err.name} | ${err.message}`)
      } finally {
        setIsTodoListLoading(false)
      }
    }

    fetchTodos()
  }, [token])

  const addTodo = async (todoTitle) => {
    const tempId = Date.now()

    const tempTodo = {
      id: tempId,
      title: todoTitle,
      isCompleted: false,
    }

    setTodoList((prev) => [tempTodo, ...prev])

    try {
      setError("")

      const response = await fetch(`${baseUrl}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
        body: JSON.stringify({
          title: todoTitle,
          isCompleted: false,
        }),
      })

      if (response.status === 401) throw new Error("unauthorized")
      if (!response.ok) throw new Error(`request failed: ${response.status}`)

      const savedTodo = await response.json()

      setTodoList((prev) => prev.map((t) => (t.id === tempId ? savedTodo : t)))
    } catch (err) {
      setTodoList((prev) => prev.filter((t) => t.id !== tempId))
      setError(`Error: ${err.name} | ${err.message}`)
    }
  }

  const completeTodo = async (id) => {
    let originalTodo

    setTodoList((prev) => {
      originalTodo = prev.find((t) => t.id === id)
      if (!originalTodo) return prev
      return prev.map((t) => (t.id === id ? { ...t, isCompleted: true } : t))
    })
    if (!originalTodo) return

    if (!originalTodo.createdTime) {
      setError("Error: todo not synced yet — try again in a second")
      setTodoList((prev) => prev.map((t) => (t.id === id ? originalTodo : t)))
      return
    }

    try {
      setError("")

      const response = await fetch(`${baseUrl}/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
        body: JSON.stringify({
          isCompleted: true,
          createdTime: originalTodo.createdTime,
        }),
      })

      if (response.status === 401) throw new Error("unauthorized")
      if (!response.ok) throw new Error(`request failed: ${response.status}`)
    } catch (err) {
      setTodoList((prev) => prev.map((t) => (t.id === id ? originalTodo : t)))
      setError(`Error: ${err.name} | ${err.message}`)
    }
  }

  const updateTodo = async (editedTodo) => {
    const cleanedTitle = editedTodo.title.trim()
    if (!cleanedTitle) {
      setError("Error: title cannot be empty")
      return
    }
    let originalTodo

    setTodoList((prev) => {
      originalTodo = prev.find((t) => t.id === editedTodo.id)
      if (!originalTodo) return prev

      const merged = { ...originalTodo, ...editedTodo, title: cleanedTitle }
      return prev.map((t) => (t.id === editedTodo.id ? editedTodo : t))
    })

    if (!originalTodo) return

    if (!originalTodo.createdTime) {
      setError("Error: todo not synced yet — try again in a second")
      setTodoList((prev) =>
        prev.map((t) => (t.id === editedTodo.id ? originalTodo : t))
      )
      return
    }

    try {
      setError("")

      const response = await fetch(`${baseUrl}/tasks/${editedTodo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
        body: JSON.stringify({
          title: editedTodo.title,
          isCompleted: editedTodo.isCompleted,
          createdTime: originalTodo.createdTime,
        }),
      })

      if (response.status === 401) throw new Error("unauthorized")
      if (!response.ok) throw new Error(`request failed: ${response.status}`)
    } catch (err) {
      setTodoList((prev) =>
        prev.map((t) => (t.id === editedTodo.id ? originalTodo : t))
      )
      setError(`Error: ${err.name} | ${err.message}`)
    }
  }

  return (
    <div>
      {error && (
        <div>
          <p>{error}</p>
          <button type="button" onClick={() => setError("")}>
            Clear Error
          </button>
        </div>
      )}

      {isTodoListLoading && <p>Loading todos...</p>}
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
    </div>
  )
}

export default TodosPage
