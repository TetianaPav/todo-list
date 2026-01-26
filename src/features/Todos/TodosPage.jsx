import { useCallback, useEffect, useState } from "react"
import TodoForm from "./TodoForm.jsx"
import TodoList from "./TodoList/TodoList.jsx"
import SortBy from "../../shared/SortBy.jsx"
import FilterInput from "../../shared/FilterInput.jsx"
import useDebounce from "../../utils/useDebounce.js"

const baseUrl = import.meta.env.VITE_BASE_URL

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([])
  const [error, setError] = useState("")
  const [isTodoListLoading, setIsTodoListLoading] = useState(false)

  // Sorting
  const [sortBy, setSortBy] = useState("creationDate")
  const [sortDirection, setSortDirection] = useState("desc")

  // Filtering (debounced)
  const [filterTerm, setFilterTerm] = useState("")
  const debouncedFilterTerm = useDebounce(filterTerm, 300)

  // Memo cache invalidation (dataVersion)
  const [dataVersion, setDataVersion] = useState(0)

  // Separate filter error
  const [filterError, setFilterError] = useState("")

  const invalidateCache = useCallback(() => {
    console.log("Invalidating memo cache after todo mutation")
    setDataVersion((prev) => prev + 1)
  }, [])

  const handleFilterChange = (newTerm) => {
    setFilterTerm(newTerm)
  }

  useEffect(() => {
    if (!token) return

    const fetchTodos = async () => {
      try {
        setError("")
        setIsTodoListLoading(true)

        const paramsObject = {
          sortBy,
          sortDirection,
        }

        if (debouncedFilterTerm) {
          paramsObject.find = debouncedFilterTerm
        }

        const params = new URLSearchParams(paramsObject)

        const response = await fetch(`${baseUrl}/tasks?${params}`, {
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
        setFilterError("")
      } catch (err) {
        const isFilteringOrSorting =
          !!debouncedFilterTerm ||
          sortBy !== "creationDate" ||
          sortDirection !== "desc"

        if (isFilteringOrSorting) {
          setFilterError(`Error filtering/sorting todos: ${err.message}`)
        } else {
          setError(`Error fetching todos: ${err.message}`)
        }
      } finally {
        setIsTodoListLoading(false)
      }
    }

    fetchTodos()
  }, [token, sortBy, sortDirection, debouncedFilterTerm])

  const addTodo = async (todoTitle) => {
    const tempId = Date.now()
    const cleanedTitle = todoTitle.trim()
    if (!cleanedTitle) return

    const tempTodo = {
      id: tempId,
      title: cleanedTitle,
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
          title: cleanedTitle,
          isCompleted: false,
        }),
      })

      if (response.status === 401) throw new Error("unauthorized")
      if (!response.ok) throw new Error(`request failed: ${response.status}`)

      const savedTodo = await response.json()

      setTodoList((prev) => prev.map((t) => (t.id === tempId ? savedTodo : t)))
      invalidateCache()
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

      invalidateCache()
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

      const mergedTodo = { ...originalTodo, ...editedTodo, title: cleanedTitle }
      return prev.map((t) => (t.id === editedTodo.id ? mergedTodo : t))
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
          title: cleanedTitle,
          isCompleted: editedTodo.isCompleted,
          createdTime: originalTodo.createdTime,
        }),
      })

      if (response.status === 401) throw new Error("unauthorized")
      if (!response.ok) throw new Error(`request failed: ${response.status}`)
      invalidateCache()
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

      {filterError && (
        <div>
          <p>{filterError}</p>

          <button type="button" onClick={() => setFilterError("")}>
            Clear Filter Error
          </button>
          <button
            type="button"
            onClick={() => {
              setFilterTerm("")
              setSortBy("creationDate")
              setSortDirection("desc")
              setFilterError("")
            }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {isTodoListLoading && <p>Loading todos...</p>}
      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={setSortBy}
        onSortDirectionChange={setSortDirection}
      />

      <FilterInput
        filterTerm={filterTerm}
        onFilterChange={handleFilterChange}
      />

      <TodoForm onAddTodo={addTodo} />

      <TodoList
        todoList={todoList}
        dataVersion={dataVersion}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
    </div>
  )
}

export default TodosPage
