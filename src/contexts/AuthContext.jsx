import { createContext, useContext, useState } from "react"

const AuthContext = createContext()

const baseUrl = import.meta.env.VITE_BASE_URL

export function AuthProvider({ children }) {
  const [token, setToken] = useState("")
  const [user, setUser] = useState(null)

  const isAuthenticated = !!token

  async function login(email, password) {
    try {
      if (!email || !password) {
        return { success: false, error: "Missing credentials" }
      }
      const response = await fetch(`${baseUrl}/user/logon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json().catch(() => ({}))

      if (response.status === 200 && data?.name && data?.csrfToken) {
        setUser({ name: data.name })
        setToken(data.csrfToken)
        return { success: true }
      }

      return {
        success: false,
        error: `Authentication failed: ${data?.message || "Unknown error"}`,
      }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  async function logout() {
    try {
      await fetch(`${baseUrl}/user/logoff`, {
        method: "POST",
        headers: token ? { "X-CSRF-TOKEN": token } : {},
        credentials: "include",
      }).catch(() => {})
    } finally {
      setToken("")
      setUser(null)
    }
    return { success: true }
  }

  return (
    <AuthContext.Provider
      value={{ token, user, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
