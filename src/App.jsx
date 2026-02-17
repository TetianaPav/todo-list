import { useState, useEffect } from "react"
import Header from "./shared/Header.jsx"
import Logon from "./features/Logon.jsx"
import TodosPage from "./features/Todos/TodosPage.jsx"
import styles from "./App.module.css"
import { Routes, Route, Navigate } from "react-router-dom"
import About from "./features/About.jsx"
import Profile from "./features/Profile.jsx"

function App() {
  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark")

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Header
            email={email}
            token={token}
            onSetToken={setToken}
            onSetEmail={setEmail}
          />
        </div>
      </header>

      {/* Main content wrapper */}
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Dark mode toggle */}
          <button
            type="button"
            className={styles.themeToggle}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "🌙" : "🌞"}
          </button>

          {token ? (
            <Routes>
              <Route path="/" element={<TodosPage token={token} />} />
              <Route path="/about" element={<About />} />
              <Route path="/profile" element={<Profile email={email} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          ) : (
            <Routes>
              <Route
                path="/"
                element={<Logon onSetEmail={setEmail} onSetToken={setToken} />}
              />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
