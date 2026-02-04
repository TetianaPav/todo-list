import { useState } from "react"
import { useAuth } from "../contexts/AuthContext.jsx"

function Logoff() {
  const { logout } = useAuth()
  const [isLoggingOff, setIsLoggingOff] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOff(true)
    try {
      await logout()
    } finally {
      setIsLoggingOff(false)
    }
  }

  return (
    <button type="button" onClick={handleLogout} disabled={isLoggingOff}>
      {isLoggingOff ? "Logging out..." : "Log Out"}
    </button>
  )
}

export default Logoff
