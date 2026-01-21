import TodoListItem from "./TodoListItem.jsx"

function TodoList({ todoList, onCompleteTodo, onUpdateTodo }) {
  const active = todoList.filter((t) => !t.isCompleted)
  const completed = todoList.filter((t) => t.isCompleted)

  if (todoList.length === 0) return <p>Add todo above to get started</p>

  return (
    <>
      <h2>Active</h2>
      {active.length === 0 ? (
        <p>No active todos</p>
      ) : (
        <ul>
          {active.map((todo) => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              onCompleteTodo={onCompleteTodo}
              onUpdateTodo={onUpdateTodo}
            />
          ))}
        </ul>
      )}

      <h2>Completed</h2>
      {completed.length === 0 ? (
        <p>No completed todos</p>
      ) : (
        <ul>
          {completed.map((todo) => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              onCompleteTodo={onCompleteTodo}
              onUpdateTodo={onUpdateTodo}
            />
          ))}
        </ul>
      )}
    </>
  )
}
export default TodoList
