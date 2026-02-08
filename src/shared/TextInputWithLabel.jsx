function TextInputWithLabel({
  elementId,
  labelText,
  onChange,
  inputRef,
  value,
  type = "text",
}) {
  return (
    <>
      <label htmlFor={elementId}>{labelText}</label>
      <input
        id={elementId}
        name={elementId}
        type={type}
        value={value ?? ""}
        onChange={onChange}
        ref={inputRef}
      />
    </>
  )
}

export default TextInputWithLabel
