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
        type={type}
        ref={inputRef}
        value={value}
        onChange={onChange}
      />
    </>
  )
}

export default TextInputWithLabel
