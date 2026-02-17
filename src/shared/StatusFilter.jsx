import styles from "./StatusFilter.module.css"

function StatusFilter({ value, onChange }) {
  return (
    <nav className={styles.wrap} aria-label="Todo filter">
      <button
        type="button"
        className={`${styles.button} ${value === "all" ? styles.active : ""}`}
        aria-pressed={value === "all"}
        onClick={() => onChange("all")}
      >
        All
      </button>

      <button
        type="button"
        className={`${styles.button} ${
          value === "active" ? styles.active : ""
        }`}
        aria-pressed={value === "active"}
        onClick={() => onChange("active")}
      >
        Active
      </button>

      <button
        type="button"
        className={`${styles.button} ${
          value === "completed" ? styles.active : ""
        }`}
        aria-pressed={value === "completed"}
        onClick={() => onChange("completed")}
      >
        Completed
      </button>
    </nav>
  )
}

export default StatusFilter
