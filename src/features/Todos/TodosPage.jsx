import { useState } from "react"
import TodoForm from "./TodoForm.jsx"
import TodoList from "./TodoList/TodoList.jsx"

function TodosPage() {
  const [todoList, setTodoList] = useState([])

  const addTodo = (todoTitle) => {
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
    }
    setTodoList((prev) => [newTodo, ...prev])
  }

  const completeTodo = (id) => {
    setTodoList((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: true } : todo
      )
    )
  }

  const updateTodo = (editedTodo) => {
    setTodoList((prev) =>
      prev.map((todo) => (todo.id === editedTodo.id ? { ...editedTodo } : todo))
    )
  }

  return (
    <div>
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
