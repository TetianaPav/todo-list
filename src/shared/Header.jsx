import { useAuth } from "../contexts/AuthContext.jsx"
import Logoff from "../features/Logoff.jsx"

function Header() {
  const { isAuthenticated, email } = useAuth()

  return (
    <header>
      <h1>Todo List</h1>
      {isAuthenticated && (
        <div>
          <span>{email}</span>
          <Logoff />
        </div>
      )}
    </header>
  )
}

export default Header
