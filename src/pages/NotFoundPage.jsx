import { Link } from "react-router"

function NotFoundPage() {
  return (
    <div>
      <h2>404: Not Found</h2>
      <p>That page doesn’t exist.</p>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/todos">Todos</Link>
      </div>
    </div>
  )
}

export default NotFoundPage
