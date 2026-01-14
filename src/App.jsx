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

    setTodoList([newTodo, ...todoList])
  }

  const completeTodo = (id) => {
    const updatedTodoList = todoList.map((todo) =>
      todo.id === id ? { ...todo, isCompleted: true } : todo
    )
    setTodoList(updatedTodoList)
  }

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} />
    </div>
  )
}

export default App
