export const TODO_ACTIONS = {
  // Fetch
  FETCH_START: "FETCH_START",
  FETCH_SUCCESS: "FETCH_SUCCESS",
  FETCH_ERROR: "FETCH_ERROR",

  // UI
  SET_SORT: "SET_SORT",
  SET_FILTER: "SET_FILTER",
  RESET_FILTERS: "RESET_FILTERS",
  BUMP_DATA_VERSION: "BUMP_DATA_VERSION",

  // Errors
  CLEAR_ERROR: "CLEAR_ERROR",
  CLEAR_FILTER_ERROR: "CLEAR_FILTER_ERROR",

  // Add
  ADD_TODO_START: "ADD_TODO_START",
  ADD_TODO_SUCCESS: "ADD_TODO_SUCCESS",
  ADD_TODO_ERROR: "ADD_TODO_ERROR",

  // Complete
  COMPLETE_TODO_START: "COMPLETE_TODO_START",
  COMPLETE_TODO_SUCCESS: "COMPLETE_TODO_SUCCESS",
  COMPLETE_TODO_ERROR: "COMPLETE_TODO_ERROR",

  // Update
  UPDATE_TODO_START: "UPDATE_TODO_START",
  UPDATE_TODO_SUCCESS: "UPDATE_TODO_SUCCESS",
  UPDATE_TODO_ERROR: "UPDATE_TODO_ERROR",
}

export const initialTodoState = {
  todoList: [],
  error: "",
  filterError: "",
  isTodoListLoading: true,
  sortBy: "creationDate",
  sortDirection: "desc",
  filterTerm: "",
  dataVersion: 0,
}

export function todoReducer(state, action) {
  switch (action.type) {
    // FETCH
    // =========================
    case TODO_ACTIONS.FETCH_START: {
      return {
        ...state,
        isTodoListLoading: true,
        error: "",
        filterError: "",
      }
    }

    case TODO_ACTIONS.FETCH_SUCCESS: {
      const todos = action.payload?.todos ?? []

      const normalized = todos.map((t) => {
        const completedTime = t.completedTime ?? t.completed_at ?? null

        return {
          ...t,
          isCompleted:
            typeof t.isCompleted === "boolean"
              ? t.isCompleted
              : !!completedTime,
          completedTime,
          createdTime:
            t.createdTime ?? t.creationDate ?? t.createdAt ?? t.createdDate,
        }
      })

      return {
        ...state,
        todoList: normalized,
        isTodoListLoading: false,
        filterError: "",
      }
    }

    case TODO_ACTIONS.FETCH_ERROR: {
      const message = action.payload?.message ?? "Unknown error"
      const isFilteringOrSorting = !!action.payload?.isFilteringOrSorting

      return {
        ...state,
        isTodoListLoading: false,
        ...(isFilteringOrSorting
          ? { filterError: `Error filtering/sorting todos: ${message}` }
          : { error: `Error fetching todos: ${message}` }),
      }
    }

    // UI: sort / filter / reset
    // =========================
    case TODO_ACTIONS.SET_FILTER: {
      return {
        ...state,
        filterTerm: action.payload?.filterTerm ?? "",
      }
    }

    case TODO_ACTIONS.SET_SORT: {
      return {
        ...state,
        sortBy: action.payload?.sortBy ?? state.sortBy,
        sortDirection: action.payload?.sortDirection ?? state.sortDirection,
      }
    }

    case TODO_ACTIONS.RESET_FILTERS: {
      return {
        ...state,
        filterTerm: "",
        sortBy: "creationDate",
        sortDirection: "desc",
        error: "",
        filterError: "",
      }
    }

    case TODO_ACTIONS.BUMP_DATA_VERSION: {
      return {
        ...state,
        dataVersion: state.dataVersion + 1,
      }
    }

    // Errors
    // =========================
    case TODO_ACTIONS.CLEAR_ERROR: {
      return {
        ...state,
        error: "",
      }
    }

    case TODO_ACTIONS.CLEAR_FILTER_ERROR: {
      return {
        ...state,
        filterError: "",
      }
    }

    // ADD
    // =========================
    case TODO_ACTIONS.ADD_TODO_START: {
      const tempTodo = action.payload?.tempTodo
      if (!tempTodo) return state

      return {
        ...state,
        error: "",
        todoList: [tempTodo, ...state.todoList],
      }
    }

    case TODO_ACTIONS.ADD_TODO_SUCCESS: {
      const tempId = action.payload?.tempId
      const savedTodo = action.payload?.savedTodo
      if (!tempId || !savedTodo) return state

      const completedTime =
        savedTodo.completedTime ?? savedTodo.completed_at ?? null

      const normalizedSaved = {
        ...savedTodo,
        isCompleted:
          typeof savedTodo.isCompleted === "boolean"
            ? savedTodo.isCompleted
            : !!completedTime,
        completedTime,
        createdTime:
          savedTodo.createdTime ??
          savedTodo.creationDate ??
          savedTodo.createdAt ??
          savedTodo.createdDate,
      }

      return {
        ...state,
        todoList: state.todoList.map((t) =>
          t.id === tempId ? normalizedSaved : t
        ),
      }
    }

    case TODO_ACTIONS.ADD_TODO_ERROR: {
      const tempId = action.payload?.tempId
      const message = action.payload?.message ?? "Error adding todo"
      if (!tempId) {
        return { ...state, error: message }
      }

      return {
        ...state,
        todoList: state.todoList.filter((t) => t.id !== tempId),
        error: message,
      }
    }

    // COMPLETE
    // =========================
    case TODO_ACTIONS.COMPLETE_TODO_START: {
      const id = action.payload?.id
      if (!id) return state

      const now = new Date().toISOString()

      return {
        ...state,
        error: "",
        todoList: state.todoList.map((t) =>
          t.id === id ? { ...t, isCompleted: true, completedTime: now } : t
        ),
      }
    }

    case TODO_ACTIONS.COMPLETE_TODO_SUCCESS: {
      return state
    }

    case TODO_ACTIONS.COMPLETE_TODO_ERROR: {
      const message = action.payload?.message ?? "Error completing todo"
      const id = action.payload?.id
      const originalTodo = action.payload?.originalTodo

      if (id && originalTodo) {
        return {
          ...state,
          todoList: state.todoList.map((t) => (t.id === id ? originalTodo : t)),
          error: message,
        }
      }

      return {
        ...state,
        error: message,
      }
    }

    // UPDATE
    // =========================
    case TODO_ACTIONS.UPDATE_TODO_START: {
      const editedTodo = action.payload?.editedTodo
      if (!editedTodo?.id) return state

      return {
        ...state,
        error: "",
        todoList: state.todoList.map((t) =>
          t.id === editedTodo.id ? editedTodo : t
        ),
      }
    }

    case TODO_ACTIONS.UPDATE_TODO_SUCCESS: {
      return state
    }

    case TODO_ACTIONS.UPDATE_TODO_ERROR: {
      const message = action.payload?.message ?? "Error updating todo"
      const id = action.payload?.id
      const originalTodo = action.payload?.originalTodo

      if (id && originalTodo) {
        return {
          ...state,
          todoList: state.todoList.map((t) => (t.id === id ? originalTodo : t)),
          error: message,
        }
      }

      return {
        ...state,
        error: message,
      }
    }

    default:
      throw new Error(`Unknown action type: ${action.type}`)
  }
}
