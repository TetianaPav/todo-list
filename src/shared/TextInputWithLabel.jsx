function TextInputWithLabel({
  elementId,
  labelText,
  onChange,
  inputRef,
  value,
}) {
  return (
    <>
      <label htmlFor={elementId}>{labelText}</label>
      <input
        type="checkbox"
        checked={todo.isCompleted}
        disabled={todo.isCompleted}
        onChange={() => onCompleteTodo(todo.id)}
      />
    </>
  )
}

export default TextInputWithLabel
