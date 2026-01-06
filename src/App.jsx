import "./App.css"
import { useState } from "react"
import TodoList from "./TodoList.jsx"
import TodoForm from "./TodoForm.jsx"

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
