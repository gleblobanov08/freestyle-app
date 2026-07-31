import { Link } from 'react-router-dom'

function ProfilePage({ user }) {
  return (
    <main className="app-shell">
      <section className="auth-card">
        <h1>Profile</h1>
        <p className="helper-text">{user?.displayName || user?.email || 'Google User'}</p>
        <Link className="inline-link" to="/">Back to home</Link>
      </section>
    </main>
  )
}

export default ProfilePage
