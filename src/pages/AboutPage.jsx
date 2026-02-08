function AboutPage() {
  return (
    <div>
      <h2>About</h2>
      <p>This is a Todo app built with React, Vite, and React Router v7.</p>

      <h3>Features</h3>
      <ul>
        <li>Protected routes (Todos, Profile)</li>
        <li>URL-based filtering (/todos?status=completed)</li>
        <li>Programmatic redirects after login/logout</li>
        <li>404 page for unknown routes</li>
      </ul>

      <h3>Tech</h3>
      <ul>
        <li>React</li>
        <li>React Router v7</li>
        <li>Vite</li>
      </ul>
    </div>
  )
}

export default AboutPage
