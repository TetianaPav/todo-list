import { useEffect, useState, useMemo } from "react"
import TodoForm from "./TodoForm.jsx"
import TodoList from "./TodoList/TodoList.jsx"
import { sanitizePlainText } from "../../utils/sanitize.js"
import { useSearchParams } from "react-router-dom"
import StatusFilter from "../../shared/StatusFilter.jsx"
import styles from "./TodosPage.module.css"

const baseUrl = import.meta.env.VITE_BASE_URL

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([])
  const [error, setError] = useState("")
  const [isTodoListLoading, setIsTodoListLoading] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const status = searchParams.get("status") || "all"
  const activeCount = todoList.filter((t) => !t.isCompleted).length
  const completedCount = todoList.filter((t) => t.isCompleted).length
  const [sortDir, setSortDir] = useState("desc")
  const [sortBy, setSortBy] = useState("date")

  const fetchTodos = async () => {
    try {
      setError("")
      setIsTodoListLoading(true)

      const response = await fetch(`${baseUrl}/tasks?ts=${Date.now()}`, {
        method: "GET",
        headers: {
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
        cache: "no-store",
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
      console.error(err)
      setError("Something went wrong. Please try again.")
    } finally {
      setIsTodoListLoading(false)
    }
  }

  useEffect(() => {
    if (!token) return
    fetchTodos()
  }, [token])

  //ADD

  const addTodo = async (todoTitle) => {
    const tempId = Date.now()
    const safeTitle = sanitizePlainText(todoTitle)

    const tempTodo = {
      id: tempId,
      title: safeTitle,
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
          title: safeTitle,
          isCompleted: false,
        }),
      })

      if (response.status === 401) throw new Error("unauthorized")
      if (!response.ok) throw new Error(`request failed: ${response.status}`)

      const savedTodo = await response.json()

      setTodoList((prev) => prev.map((t) => (t.id === tempId ? savedTodo : t)))
    } catch (err) {
      setTodoList((prev) => prev.filter((t) => t.id !== tempId))
      console.error(err)
      setError("Something went wrong. Please try again.")
    }
  }

  // COMPLETE

  const completeTodo = async (id) => {
    let originalTodo

    setTodoList((prev) => {
      originalTodo = prev.find((t) => t.id === id)
      if (!originalTodo) return prev
      return prev.map((t) =>
        t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
      )
    })
    if (!originalTodo) return

    if (!originalTodo.createdAt) {
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
          isCompleted: !originalTodo.isCompleted,
        }),
      })

      if (response.status === 401) throw new Error("unauthorized")
      if (!response.ok) throw new Error("request failed")
    } catch {
      setTodoList((prev) => prev.map((t) => (t.id === id ? originalTodo : t)))
      setError("Could not update the todo. Please try again.")
    }
  }

  //UPDATE

  const updateTodo = async (editedTodo) => {
    const cleanedTitle = sanitizePlainText(editedTodo.title)
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

    if (!originalTodo.createdAt) {
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
          title: cleanedTitle,
          isCompleted: editedTodo.isCompleted,
        }),
      })

      if (response.status === 401) throw new Error("unauthorized")
      if (!response.ok) throw new Error(`request failed: ${response.status}`)
    } catch (err) {
      setTodoList((prev) =>
        prev.map((t) => (t.id === editedTodo.id ? originalTodo : t))
      )
      console.error(err)
      setError("Something went wrong. Please try again.")
    }
  }

  //FILTER + SORT

  const getTodoTime = (t) => {
    const parsed =
      Date.parse(t.createdAt) ||
      Date.parse(t.createdTime) ||
      Date.parse(t.updatedAt)

    if (Number.isFinite(parsed)) return parsed

    return typeof t.id === "number" ? t.id : 0
  }

  const filteredTodos = useMemo(() => {
    const list =
      status === "active"
        ? todoList.filter((t) => !t.isCompleted)
        : status === "completed"
        ? todoList.filter((t) => t.isCompleted)
        : todoList

    const dir = sortDir === "asc" ? 1 : -1

    return [...list].sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title) * dir
      }
      return (getTodoTime(a) - getTodoTime(b)) * dir
    })
  }, [todoList, status, sortBy, sortDir])

  //DELETE

  const deleteTodo = async (id) => {
    let originalTodo

    setTodoList((prev) => {
      originalTodo = prev.find((t) => t.id === id)
      return prev.filter((t) => t.id !== id)
    })

    if (!originalTodo) return

    const isSynced = Boolean(originalTodo.createdAt)
    if (!isSynced) return

    try {
      setError("")

      const url = `${baseUrl}/tasks/${id}`

      const response = await fetch(`${baseUrl}/tasks/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
      })

      if (response.status === 401) throw new Error("unauthorized")
      if (!response.ok) throw new Error(`request failed: ${response.status}`)
      await fetchTodos()
    } catch (err) {
      setTodoList((prev) => [originalTodo, ...prev])
      setError("Something went wrong. Please try again.")
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.topRow}>
        <StatusFilter
          value={status}
          onChange={(next) => {
            if (next === "all") setSearchParams({})
            else setSearchParams({ status: next })
          }}
        />

        <label className={styles.sortLabel}>
          <span>Sort</span>

          <select
            className={styles.select}
            value={`${sortBy}:${sortDir}`}
            onChange={(e) => {
              const [by, dir] = e.target.value.split(":")
              setSortBy(by)
              setSortDir(dir)
            }}
            aria-label="Sort todos"
          >
            <option value="date:desc">Date — Newest first</option>
            <option value="date:asc">Date — Oldest first</option>
            <option value="title:asc">Title — A → Z</option>
            <option value="title:desc">Title — Z → A</option>
          </select>
        </label>

        <div className={styles.counts} aria-label="Todo counts">
          <span className={styles.badge}>Active: {activeCount}</span>
          <span className={styles.badge}>Completed: {completedCount}</span>
          <span className={styles.badge}>Total: {todoList.length}</span>
        </div>
      </div>

      {error && (
        <div className={styles.error} role="alert" aria-live="polite">
          <p className={styles.errorTitle}>Something went wrong</p>
          <p className={styles.errorText}>{error}</p>
          <div className={styles.errorActions}>
            <button
              type="button"
              className={styles.btn}
              onClick={() => setError("")}
            >
              Dismiss
            </button>

            <button type="button" className={styles.btn} onClick={fetchTodos}>
              Retry
            </button>
          </div>
        </div>
      )}

      <div className={styles.panel}>
        <TodoForm onAddTodo={addTodo} />

        {isTodoListLoading ? (
          <p className={styles.loading}>Loading todos...</p>
        ) : filteredTodos.length === 0 ? (
          <p className={styles.empty}>
            {status === "active" && "No active todos."}
            {status === "completed" && "No completed todos."}
            {status === "all" && "No todos yet."}
          </p>
        ) : (
          <TodoList
            todoList={filteredTodos}
            onCompleteTodo={completeTodo}
            onUpdateTodo={updateTodo}
            onDeleteTodo={deleteTodo}
          />
        )}
      </div>
    </div>
  )
}

export default TodosPage
