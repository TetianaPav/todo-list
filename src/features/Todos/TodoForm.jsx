import { useRef, useState } from "react"
import TextInputWithLabel from "../../shared/TextInputWithLabel.jsx"
import { validateTodoTitle } from "../../utils/todoValidation.js"
import styles from "./TodoForm.module.css"
import { sanitizePlainText } from "../../utils/sanitize.js"

const TODO_MAX_LEN = 120

function TodoForm({ onAddTodo }) {
  const inputRef = useRef(null)

  const [workingTodoTitle, setWorkingTodoTitle] = useState("")
  const [formError, setFormError] = useState("")

  const trimmed = workingTodoTitle.trim()
  const validationError = validateTodoTitle(workingTodoTitle, TODO_MAX_LEN)
  const isValid = !validationError

  const handleAddTodo = (event) => {
    event.preventDefault()

    const err = validateTodoTitle(workingTodoTitle, TODO_MAX_LEN)
    if (err) {
      setFormError(err)
      inputRef.current?.focus()
      return
    }

    const safe = sanitizePlainText(workingTodoTitle)

    const err2 = validateTodoTitle(safe, TODO_MAX_LEN)
    if (err2) {
      setFormError(err2)
      inputRef.current?.focus()
      return
    }

    onAddTodo(safe)

    setWorkingTodoTitle("")
    setFormError("")
    inputRef.current?.focus()
  }
  return (
    <form
      onSubmit={handleAddTodo}
      aria-describedby="todoFormError"
      className={styles.form}
    >
      <div className={styles.row}>
        <div className={styles.inputWrap}>
          <TextInputWithLabel
            elementId="todoTitle"
            labelText="Todo"
            inputRef={inputRef}
            value={workingTodoTitle}
            onChange={(e) => setWorkingTodoTitle(e.target.value)}
            maxLength={TODO_MAX_LEN}
            placeholder="Add a new todo..."
            ariaDescribedBy="todoFormError"
            ariaInvalid={!!formError}
          />
        </div>

        <button type="submit" disabled={!isValid} className={styles.button}>
          Add Todo
        </button>
      </div>

      <p
        id="todoFormError"
        role="alert"
        aria-live="polite"
        className={styles.error}
      >
        {formError}
      </p>
    </form>
  )
}

export default TodoForm
