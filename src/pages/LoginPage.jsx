import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router"
import { useAuth } from "../contexts/AuthContext"

function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || "/todos"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  async function handleSubmit(e) {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    const result = await login(email, password)

    if (!result?.success) {
      setError(result?.error || "Login failed")
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h2>Login</h2>

      {error ? <p role="alert">{error}</p> : null}

      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button disabled={isSubmitting}>
          {isSubmitting ? "Logging in…" : "Login"}
        </button>
      </form>
    </div>
  )
}

export default LoginPage
