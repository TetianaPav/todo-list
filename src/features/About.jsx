import styles from "./About.module.css"

function About() {
  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.title}>About This Project</h2>

        <p className={styles.text}>
          This is a full-featured Todo application built with React and Vite. It
          demonstrates authentication, CRUD operations, API persistence, secure
          input handling, and responsive UI design.
        </p>

        <ul className={styles.list}>
          <li>✔ Secure authentication with CSRF protection</li>
          <li>✔ Full CRUD: create, update, complete, and delete todos</li>
          <li>✔ Input validation and sanitization (DOMPurify)</li>
          <li>✔ Accessible and responsive UI</li>
          <li>✔ Light/Dark theme support</li>
        </ul>
      </div>
    </section>
  )
}

export default About
