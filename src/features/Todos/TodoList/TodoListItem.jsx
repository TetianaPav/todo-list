import { useState } from "react"
import TextInputWithLabel from "../../../shared/TextInputWithLabel.jsx"
import { validateTodoTitle } from "../../../utils/todoValidation.js"
import styles from "./TodoListItem.module.css"
import { sanitizePlainText } from "../../../utils/sanitize.js"

const TODO_MAX_LEN = 120

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo, onDeleteTodo }) {
  const [isEditing, setIsEditing] = useState(false)
  const [workingTitle, setWorkingTitle] = useState(todo.title)
  const [isWorking, setIsWorking] = useState(false)

  const trimmed = workingTitle.trim()
  const updateError = validateTodoTitle(workingTitle, TODO_MAX_LEN)
  const canUpdate = !updateError

  const isSynced = Boolean(todo.createdAt)

  // Cancel handler
  const handleCancel = () => {
    setWorkingTitle(todo.title)
    setIsEditing(false)
  }

  // Edit handler
  const handleEdit = (event) => {
    setWorkingTitle(event.target.value)
  }

  // Update handler
  const handleUpdate = (event) => {
    if (!isEditing) return
    event.preventDefault()
    if (!isSynced || isWorking) return
    if (updateError) return

    onUpdateTodo({ ...todo, title: sanitizePlainText(trimmed) })
    setIsEditing(false)
  }

  // Complete handler
  const handleComplete = async () => {
    if (!isSynced || isWorking) return
    try {
      setIsWorking(true)
      await onCompleteTodo(todo.id)
    } finally {
      setIsWorking(false)
    }
  }

  // Delete handler
  const handleDelete = async () => {
    if (!isSynced || isWorking) return
    const ok = window.confirm("Delete this todo?")
    if (!ok) return

    try {
      setIsWorking(true)
      await onDeleteTodo(todo.id)
    } finally {
      setIsWorking(false)
    }
  }

  return (
    <li className={styles.item}>
      <form className={styles.form} onSubmit={handleUpdate}>
        {isEditing ? (
          <>
            <TextInputWithLabel
              elementId={`editTodo${todo.id}`}
              labelText="Edit Todo"
              value={workingTitle}
              onChange={handleEdit}
              maxLength={TODO_MAX_LEN}
              placeholder="Update todo"
            />

            <div className={styles.actions}>
              <button
                type="button"
                onClick={handleCancel}
                className={styles.btn}
                disabled={isWorking}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!canUpdate || isWorking}
                className={`${styles.btn} ${styles.btnPrimary}`}
              >
                Update
              </button>
            </div>
          </>
        ) : (
          <>
            <span className={styles.check}>
              <label className={styles.srOnly} htmlFor={`checkbox${todo.id}`}>
                Mark todo as {todo.isCompleted ? "active" : "completed"}:{" "}
                {todo.title}
              </label>
              <input
                className={styles.checkbox}
                type="checkbox"
                id={`checkbox${todo.id}`}
                checked={todo.isCompleted}
                disabled={!isSynced || isWorking}
                onChange={handleComplete}
              />
            </span>
            <span
              className={`${styles.title} ${
                todo.isCompleted ? styles.completed : ""
              }`}
              role="button"
              tabIndex={0}
              onClick={() => {
                if (!isSynced || isWorking) return
                setWorkingTitle(todo.title)
                setIsEditing(true)
              }}
              onKeyDown={(e) => {
                if (!isSynced || isWorking) return
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  setWorkingTitle(todo.title)
                  setIsEditing(true)
                }
              }}
              aria-label={`Edit todo: ${todo.title}`}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className={`${styles.btn} ${styles.btnDanger}`}
              disabled={!isSynced || isWorking}
              onClick={handleDelete}
            >
              Delete
            </button>
          </>
        )}
      </form>
    </li>
  )
}

export default TodoListItem
