import "./App.css"
import { useState } from "react"
import TodoForm from "./features/TodoForm.jsx"
import TodoList from "./features/TodoList/TodoList.jsx"

function App() {
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
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
    </div>
  )
}

export default App
