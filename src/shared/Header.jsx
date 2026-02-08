import Navigation from "./Navigation"
import Logoff from "../features/Logoff"
import { useAuth } from "../contexts/AuthContext"

function Header() {
  const { isAuthenticated, user } = useAuth()
  return (
    <header>
      <h1>Todo App</h1>
      <Navigation />
      {isAuthenticated && (
        <div>
          <span>{user?.name}</span>
          <Logoff />
        </div>
      )}
    </header>
  )
}

export default Header
