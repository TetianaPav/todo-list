import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"

const baseUrl = import.meta.env.VITE_BASE_URL

function ProfilePage() {
  const { user, token, isAuthenticated } = useAuth()

  const [todoStats, setTodoStats] = useState({
    total: 0,
    completed: 0,
    active: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchTodoStats() {
      if (!token) return

      try {
        setLoading(true)
        setError("")

        const options = {
          method: "GET",
          headers: { "X-CSRF-TOKEN": token },
          credentials: "include",
        }

        const response = await fetch(`${baseUrl}/tasks`, options)

        if (response.status === 401) throw new Error("Unauthorized")
        if (!response.ok) throw new Error("Failed to fetch todos")

        const todos = await response.json()

        const total = todos.length
        const completed = todos.filter((t) => t.isCompleted).length
        const active = total - completed

        setTodoStats({ total, completed, active })
      } catch (err) {
        setError(`Error loading statistics: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchTodoStats()
  }, [token])

  const completionPct =
    todoStats.total > 0
      ? Math.round((todoStats.completed / todoStats.total) * 100)
      : 0

  return (
    <div>
      <h2>Profile</h2>

      <section>
        <h3>Account</h3>
        <p>Status: {isAuthenticated ? "Authenticated" : "Not authenticated"}</p>
        <p>
          Name:
          {user?.name || "Unknown"}
        </p>
      </section>

      <section>
        <h3>Todo Statistics</h3>

        {loading ? <p>Loading statistics…</p> : null}
        {error ? <p role="alert">{error}</p> : null}

        {!loading && !error ? (
          <>
            <p>Total: {todoStats.total}</p>
            <p>Completed: {todoStats.completed}</p>
            <p>Active: {todoStats.active}</p>
            {todoStats.total > 0 ? (
              <p>Completion: {completionPct}%</p>
            ) : (
              <p>No todos yet.</p>
            )}
          </>
        ) : null}
      </section>
    </div>
  )
}

export default ProfilePage
