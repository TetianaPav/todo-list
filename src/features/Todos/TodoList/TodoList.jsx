import TodoListItem from "./TodoListItem.jsx"
import { useMemo } from "react"

function TodoList({
  todoList,
  onCompleteTodo,
  onUpdateTodo,
  statusFilter = "all",
}) {
  const filteredTodos = useMemo(() => {
    switch (statusFilter) {
      case "completed":
        return todoList.filter((t) => t.isCompleted)
      case "active":
        return todoList.filter((t) => !t.isCompleted)
      case "all":
      default:
        return todoList
    }
  }, [todoList, statusFilter])

  const getEmptyMessage = () => {
    switch (statusFilter) {
      case "completed":
        return "No completed todos yet. Complete some tasks to see them here."
      case "active":
        return "No active todos. Add a todo above to get started."
      case "all":
      default:
        return "Add todo above to get started."
    }
  }

  if (filteredTodos.length === 0) return <p>{getEmptyMessage()}</p>

  return (
    <ul>
      {filteredTodos.map((todo) => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          onCompleteTodo={onCompleteTodo}
          onUpdateTodo={onUpdateTodo}
        />
      ))}
    </ul>
  )
}
export default TodoList
