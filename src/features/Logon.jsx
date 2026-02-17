import { useState, useMemo } from "react"
import styles from "./Logon.module.css"

const baseUrl = import.meta.env.VITE_BASE_URL

function Logon({ onSetEmail, onSetToken }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState("")
  const [isLoggingOn, setIsLoggingOn] = useState(false)

  const cleanedEmail = useMemo(() => email.trim(), [email])
  const canSubmit =
    cleanedEmail.length > 0 && password.length > 0 && !isLoggingOn

  const handleSubmit = async (event) => {
    event.preventDefault()
    setAuthError("")
    setIsLoggingOn(true)

    try {
      const response = await fetch(`${baseUrl}/user/logon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: cleanedEmail, password }),
      })

      const data = await response.json().catch(() => ({}))

      if (response.ok && data?.csrfToken) {
        onSetEmail(cleanedEmail)
        onSetToken(data.csrfToken)
      } else {
        setAuthError("Login failed. Check your email/password and try again.")
      }
    } catch {
      setAuthError("Network error. Please try again.")
    } finally {
      setIsLoggingOn(false)
    }
  }

  return (
    <div className={styles.page}>
      <form
        onSubmit={handleSubmit}
        className={styles.card}
        aria-describedby="authError"
      >
        <h2 className={styles.title}>Log in</h2>
        <p className={styles.subtitle}>
          Use your test account to access your todos.
        </p>

        <p
          id="authError"
          className={styles.error}
          role="alert"
          aria-live="polite"
        >
          {authError}
        </p>

        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            id="email"
            className={styles.input}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            id="password"
            className={styles.input}
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className={styles.button} disabled={!canSubmit}>
          {isLoggingOn ? "Logging in..." : "Log in"}
        </button>
      </form>
    </div>
  )
}

export default Logon
