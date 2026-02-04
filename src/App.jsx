import Header from "./shared/Header.jsx"
import Logon from "./features/Logon.jsx"
import TodosPage from "./features/Todos/TodosPage.jsx"
import { useAuth } from "./contexts/AuthContext.jsx"

function App() {
  const { token } = useAuth()

  return (
    <div>
      <Header />
      {token ? <TodosPage /> : <Logon />}
    </div>
  )
}

export default App
