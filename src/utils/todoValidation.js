const DEFAULT_MAX_LEN = 120

// Returns an empty string when valid; otherwise returns a user-friendly error message.
export function validateTodoTitle(title, maxLen = DEFAULT_MAX_LEN) {
  const raw = String(title ?? "")
  const trimmed = raw.trim()

  if (!trimmed) return "Please enter a todo."
  if (trimmed.length > maxLen)
    return `Todo must be ${maxLen} characters or less.`

  const invalid =
    /[\u0000-\u001F\u007F]/.test(trimmed) || // control chars
    /[\u200B-\u200F\u202A-\u202E\u2060-\u206F]/.test(trimmed) // invisible directionality chars

  if (invalid) return "Todo contains unsupported characters."

  return ""
}
