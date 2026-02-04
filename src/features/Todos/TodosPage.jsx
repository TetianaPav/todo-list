import { useCallback, useEffect, useReducer } from "react"
import {
  todoReducer,
  initialTodoState,
  TODO_ACTIONS,
} from "../../reducers/todoReducer"
import TodoForm from "./TodoForm.jsx"
import TodoList from "./TodoList/TodoList.jsx"
import SortBy from "../../shared/SortBy.jsx"
import FilterInput from "../../shared/FilterInput.jsx"
import useDebounce from "../../utils/useDebounce.js"
import { useAuth } from "../../contexts/AuthContext.jsx"

const baseUrl = import.meta.env.VITE_BASE_URL

// FIX: read server error text so 400 becomes understandable
const readErrorBody = async (res) => {
  try {
    const text = await res.text()
    return text || "(empty error body)"
  } catch {
    return "(failed to read error body)"
  }
}
//========================================

function TodosPage() {
  const { token } = useAuth()
  const [state, dispatch] = useReducer(todoReducer, initialTodoState)
  const {
    todoList,
    error,
    isTodoListLoading,
    sortBy,
    sortDirection,
    filterTerm,
    dataVersion,
    filterError,
  } = state

  const debouncedFilterTerm = useDebounce(filterTerm, 300)

  const invalidateCache = useCallback(() => {
    dispatch({ type: TODO_ACTIONS.BUMP_DATA_VERSION })
  }, [dispatch])

  const handleFilterChange = (newTerm) => {
    dispatch({
      type: TODO_ACTIONS.SET_FILTER,
      payload: { filterTerm: newTerm },
    })
  }

  useEffect(() => {
    if (!token) return

    const fetchTodos = async () => {
      try {
        dispatch({ type: TODO_ACTIONS.FETCH_START })

        const paramsObject = {
          sortBy,
          sortDirection,
        }

        if (debouncedFilterTerm) {
          paramsObject.find = debouncedFilterTerm
        }

        const params = new URLSearchParams(paramsObject)

        //GET
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
          const bodyText = await readErrorBody(response)
          throw new Error(`request failed: ${response.status} | ${bodyText}`)
        }

        const data = await response.json()

        dispatch({
          type: TODO_ACTIONS.FETCH_SUCCESS,
          payload: { todos: data },
        })
      } catch (err) {
        const isFilteringOrSorting =
          !!debouncedFilterTerm ||
          sortBy !== "creationDate" ||
          sortDirection !== "desc"

        dispatch({
          type: TODO_ACTIONS.FETCH_ERROR,
          payload: {
            message: err.message,
            isFilteringOrSorting: isFilteringOrSorting,
          },
        })
      }
    }

    fetchTodos()
  }, [token, sortBy, sortDirection, debouncedFilterTerm, dataVersion, dispatch])

  //ADD
  //===============
  const addTodo = async (todoTitle) => {
    const tempId = Date.now()
    const cleanedTitle = todoTitle.trim()
    if (!cleanedTitle) return

    const tempTodo = {
      id: tempId,
      title: cleanedTitle,
      isCompleted: false,
      completedTime: null,
    }

    dispatch({
      type: TODO_ACTIONS.ADD_TODO_START,
      payload: { tempTodo },
    })

    try {
      dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })
      //POST
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
      if (!response.ok) {
        const bodyText = await readErrorBody(response)
        throw new Error(`request failed: ${response.status} | ${bodyText}`)
      }

      const savedTodo = await response.json()

      dispatch({
        type: TODO_ACTIONS.ADD_TODO_SUCCESS,
        payload: { tempId, savedTodo },
      })
      invalidateCache()
    } catch (err) {
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        payload: { tempId, message: `Error: ${err.name} | ${err.message}` },
      })
    }
  }

  //COMPLETE
  //======================
  const completeTodo = async (id) => {
    const originalTodo = todoList.find((t) => t.id === id)
    if (!originalTodo) return

    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_START,
      payload: { id },
    })

    try {
      dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })
      //PATCH
      const response = await fetch(`${baseUrl}/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
        body: JSON.stringify({
          isCompleted: true,
        }),
      })

      if (response.status === 401) throw new Error("unauthorized")
      if (!response.ok) {
        const bodyText = await readErrorBody(response)
        throw new Error(`request failed: ${response.status} | ${bodyText}`)
      }

      dispatch({ type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS })
      invalidateCache()
    } catch (err) {
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: {
          id,
          originalTodo,
          message: `Error: ${err.name} | ${err.message}`,
        },
      })
    }
  }

  //UPDATE
  //====================
  const updateTodo = async (editedTodo) => {
    const cleanedTitle = editedTodo.title.trim()
    if (!cleanedTitle) {
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: { message: "Error: title cannot be empty" },
      })
      return
    }

    const originalTodo = todoList.find((t) => t.id === editedTodo.id)
    if (!originalTodo) return

    const mergedTodo = { ...originalTodo, ...editedTodo, title: cleanedTitle }

    // Optimistic UI update
    //=======================
    dispatch({
      type: TODO_ACTIONS.UPDATE_TODO_START,
      payload: { editedTodo: mergedTodo },
    })

    try {
      dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })
      //PATCH
      const response = await fetch(`${baseUrl}/tasks/${editedTodo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
        body: JSON.stringify({ title: cleanedTitle }),
      })

      if (response.status === 401) throw new Error("unauthorized")
      if (!response.ok) {
        const bodyText = await response.text().catch(() => "(no body)")
        throw new Error(`request failed: ${response.status} | ${bodyText}`)
      }

      dispatch({ type: TODO_ACTIONS.UPDATE_TODO_SUCCESS })
      invalidateCache()
    } catch (err) {
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: {
          id: editedTodo.id,
          originalTodo,
          message: `Error: ${err.name} | ${err.message}`,
        },
      })
    }
  }

  return (
    <div>
      {error && (
        <div>
          <p>{error}</p>
          <button
            type="button"
            onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}
          >
            Clear Error
          </button>
        </div>
      )}

      {filterError && (
        <div>
          <p>{filterError}</p>
          <button
            type="button"
            onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })}
          >
            Clear Filter Error
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: TODO_ACTIONS.RESET_FILTERS })}
          >
            Reset Filters
          </button>
        </div>
      )}

      {isTodoListLoading && <p>Loading todos...</p>}
      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={(newSortBy) =>
          dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: { sortBy: newSortBy, sortDirection },
          })
        }
        onSortDirectionChange={(newSortDirection) =>
          dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: { sortBy, sortDirection: newSortDirection },
          })
        }
      />
      <FilterInput
        filterTerm={filterTerm}
        onFilterChange={handleFilterChange}
      />
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
