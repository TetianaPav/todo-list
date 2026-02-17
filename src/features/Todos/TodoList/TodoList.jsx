import TodoListItem from "./TodoListItem.jsx"
import styles from "./TodoList.module.css"

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, onDeleteTodo }) {
  if (todoList.length === 0) {
    return <p className={styles.pageEmpty}>Add a todo above to get started.</p>
  }

  return (
    <ul className={styles.list}>
      {todoList.map((todo) => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          onCompleteTodo={onCompleteTodo}
          onUpdateTodo={onUpdateTodo}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
    </ul>
  )
}
export default TodoList
