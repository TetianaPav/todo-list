import styles from "./Profile.module.css"

function Profile({ email }) {
  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.title}>Profile</h2>

        <p className={styles.text}>
          Logged in as: <strong>{email || "User"}</strong>
        </p>

        <p className={styles.subtext}>
          This demo uses secure authentication with CSRF protection. Your
          session token is stored in memory and used for authorized API
          requests.
        </p>
      </div>
    </section>
  )
}

export default Profile
