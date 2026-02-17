import styles from "./Header.module.css"
import { NavLink } from "react-router-dom"

function Header({ email, token, onSetToken, onSetEmail }) {
  const handleLogout = () => {
    onSetToken("")
    onSetEmail("")
  }

  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles.title}>Todo List</h1>

        <nav className={styles.nav} aria-label="Main navigation">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
            end
          >
            Todos
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
          >
            About
          </NavLink>

          {token && (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ""}`
              }
            >
              Profile
            </NavLink>
          )}
        </nav>
      </div>

      <div className={styles.right} aria-live="polite">
        {token ? (
          <>
            <p className={styles.profile}>
              Logged in as <strong>{email || "User"}</strong>
            </p>
            <button
              type="button"
              className={styles.logout}
              onClick={handleLogout}
            >
              Log out
            </button>
          </>
        ) : (
          <p className={styles.hint}>Please log in to access your todos.</p>
        )}
      </div>
    </div>
  )
}

export default Header
