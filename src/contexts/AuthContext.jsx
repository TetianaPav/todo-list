import { createContext, useContext, useMemo, useState } from "react"

const baseUrl = import.meta.env.VITE_BASE_URL

const AuthContext = createContext(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}

export function AuthProvider({ children }) {
  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")

  //Login
  const login = async (userEmail, password) => {
    try {
      const response = await fetch(`${baseUrl}/user/logon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: userEmail, password }),
      })

      const data = await response.json()

      if (response.ok && data?.name && data?.csrfToken) {
        setEmail(data.name)
        setToken(data.csrfToken)
        return { success: true }
      }

      return {
        success: false,
        error: `Authentication failed: ${data?.message || "Unknown error"}`,
      }
    } catch (error) {
      return {
        success: false,
        error: `Error: ${error.name} | ${error.message}`,
      }
    }
  }

  //Logout
  const logout = async () => {
    try {
      await fetch(`${baseUrl}/user/logoff`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
      })
    } catch (error) {
      console.log("Logout request failed:", error)
    } finally {
      setEmail("")
      setToken("")
    }

    return { success: true }
  }

  const value = useMemo(
    () => ({
      email,
      token,
      isAuthenticated: !!token,
      login,
      logout,
    }),
    [email, token]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
