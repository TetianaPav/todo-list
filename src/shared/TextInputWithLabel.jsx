function TextInputWithLabel({
  elementId,
  labelText,
  onChange,
  inputRef,
  value = "",
  type = "text",
  placeholder = "",
  maxLength,
  required = false,
  name,
  ariaDescribedBy,
  ariaInvalid = false,
}) {
  return (
    <div>
      <label htmlFor={elementId}>{labelText}</label>
      <input
        id={elementId}
        name={name ?? elementId}
        value={value ?? ""}
        ref={inputRef}
        type={type}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        autoComplete="off"
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid}
      />
    </div>
  )
}

export default TextInputWithLabel
