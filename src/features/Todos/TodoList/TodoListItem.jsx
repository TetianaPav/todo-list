import { useState } from "react"
import TextInputWithLabel from "../../../shared/TextInputWithLabel.jsx"
import { isValidTodoTitle } from "../../../utils/todoValidation.js"

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false)
  const [workingTitle, setWorkingTitle] = useState(todo.title)
  const isSyncing = todo.isSynced === false

  const handleCancel = () => {
    setWorkingTitle(todo.title)
    setIsEditing(false)
  }

  const handleEdit = (event) => {
    setWorkingTitle(event.target.value)
  }

  const handleUpdate = (event) => {
    if (!isEditing) return
    event.preventDefault()

    if (!isValidTodoTitle(workingTitle)) return

    onUpdateTodo({ ...todo, title: workingTitle })
    setIsEditing(false)
  }

  return (
    <li>
      <form onSubmit={handleUpdate}>
        {isEditing ? (
          <>
            <TextInputWithLabel
              elementId={`editTodo${todo.id}`}
              labelText="Todo"
              value={workingTitle}
              onChange={handleEdit}
            />
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" disabled={!isValidTodoTitle(workingTitle)}>
              Update
            </button>
          </>
        ) : (
          <>
            <label htmlFor={`checkbox${todo.id}`}>
              <input
                type="checkbox"
                id={`checkbox${todo.id}`}
                checked={todo.isCompleted}
                disabled={isSyncing}
                onChange={() => onCompleteTodo(todo.id)}
              />
            </label>
            <span
              onClick={() => {
                if (isSyncing) return
                setWorkingTitle(todo.title)
                setIsEditing(true)
              }}
              style={{
                opacity: isSyncing ? 0.6 : 1,
                cursor: isSyncing ? "not-allowed" : "pointer",
              }}
            >
              {todo.title}
            </span>
            {isSyncing ? <small> syncing…</small> : null}
          </>
        )}
      </form>
    </li>
  )
}

export default TodoListItem
