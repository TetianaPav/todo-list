import { useEffect } from "react"
import { useNavigate } from "react-router"
import { useAuth } from "../contexts/AuthContext"

function HomePage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    navigate(isAuthenticated ? "/todos" : "/login", { replace: true })
  }, [isAuthenticated, navigate])

  return <p>Redirecting...</p>
}

export default HomePage
