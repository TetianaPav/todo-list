import { useEffect, useState } from "react"
import { useSearchParams } from "react-router"
import { useAuth } from "../contexts/AuthContext"

import StatusFilter from "../shared/StatusFilter"

import TodoForm from "../features/Todos/TodoForm.jsx"
import TodoList from "../features/Todos/TodoList/TodoList.jsx"

const baseUrl = import.meta.env.VITE_BASE_URL

function TodosPage() {
  const { token } = useAuth()

  const [searchParams] = useSearchParams()
  const statusFilter = searchParams.get("status") || "all"

  const [todoList, setTodoList] = useState([])
  const [error, setError] = useState("")
  const [isTodoListLoading, setIsTodoListLoading] = useState(false)

  useEffect(() => {
    if (!token) return

    const fetchTodos = async () => {
      try {
        setError("")
        setIsTodoListLoading(true)
        //Get
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
        setTodoList(data.map((t) => ({ ...t, isSynced: true })))
      } catch (err) {
        setError(`Error: ${err.name} | ${err.message}`)
      } finally {
        setIsTodoListLoading(false)
      }
    }

    fetchTodos()
  }, [token])

  //Add =========
  const addTodo = async (todoTitle) => {
    const tempId = Date.now()

    const tempTodo = {
      id: tempId,
      title: todoTitle,
      isCompleted: false,
      isSynced: false,
    }

    setTodoList((prev) => [tempTodo, ...prev])

    try {
      setError("")
      //Post
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

      setTodoList((prev) =>
        prev.map((t) =>
          t.id === tempId ? { ...savedTodo, isSynced: true } : t
        )
      )
    } catch (err) {
      setTodoList((prev) => prev.filter((t) => t.id !== tempId))
      setError(`Error: ${err.name} | ${err.message}`)
    }
  }

  //Complete ==============
  const completeTodo = async (id) => {
    let originalTodo

    setTodoList((prev) => {
      originalTodo = prev.find((t) => t.id === id)
      if (!originalTodo) return prev
      return prev.map((t) => (t.id === id ? { ...t, isCompleted: true } : t))
    })
    if (!originalTodo) return

    if (originalTodo.isSynced === false) {
      setError("Error: todo not synced yet — try again in a second")
      setTodoList((prev) => prev.map((t) => (t.id === id ? originalTodo : t)))
      return
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

  //Update ==========

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
      return prev.map((t) => (t.id === editedTodo.id ? merged : t))
    })

    if (!originalTodo) return

    if (originalTodo.isSynced === false) {
      setError("Error: todo not synced yet — try again in a second")
      setTodoList((prev) => prev.map((t) => (t.id === id ? originalTodo : t)))
      return
      return
    }

    try {
      setError("")
      // Patch
      const response = await fetch(`${baseUrl}/tasks/${editedTodo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
        body: JSON.stringify({
          title: cleanedTitle,
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

  //return

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

      <StatusFilter />

      <TodoForm onAddTodo={addTodo} />

      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        statusFilter={statusFilter}
      />
    </div>
  )
}

export default TodosPage
