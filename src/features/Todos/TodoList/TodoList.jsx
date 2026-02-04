import TodoListItem from "./TodoListItem.jsx"
import { useMemo } from "react"

function TodoList({ todoList, onCompleteTodo, onUpdateTodo }) {
  const filteredTodoList = useMemo(() => {
    return {
      todos: todoList.filter((t) => !t.isCompleted),
    }
  }, [todoList])

  return filteredTodoList.todos.length === 0 ? (
    <p>Add todo above to get started</p>
  ) : (
    <ul>
      {filteredTodoList.todos.map((todo) => (
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
