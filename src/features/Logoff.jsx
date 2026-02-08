import { useState } from "react"
import { useNavigate } from "react-router"
import { useAuth } from "../contexts/AuthContext"

function Logoff() {
  const { logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [isLoggingOff, setIsLoggingOff] = useState(false)
  const [error, setError] = useState("")

  async function handleLogoff() {
    setIsLoggingOff(true)
    setError("")

    const result = await logout()

    if (result?.success) {
      navigate("/login")
    } else {
      setError(result?.error || "Logout failed")
      setIsLoggingOff(false)
    }
  }

  if (!isAuthenticated) return null

  return (
    <div>
      <button onClick={handleLogoff} disabled={isLoggingOff}>
        {isLoggingOff ? "Logging out…" : "Log out"}
      </button>
      {error ? <p role="alert">{error}</p> : null}
    </div>
  )
}

export default Logoff
