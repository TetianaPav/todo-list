import DOMPurify from "dompurify"

export function sanitizePlainText(input) {
  return DOMPurify.sanitize(String(input ?? "").trim(), {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  })
}
