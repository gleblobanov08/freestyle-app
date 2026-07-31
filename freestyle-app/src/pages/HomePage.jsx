import { Link } from 'react-router-dom'

function HomePage({ user, onLogout }) {
  return (
    <main className="app-shell">
      <section className="auth-card home-panel">
        <h1>home page</h1>
        <p className="helper-text">Signed in as {user?.displayName || user?.email || 'Guest'}</p>

        <nav className="page-nav">
          <Link to="/profile">Profile</Link>
          <Link to="/items">Items List</Link>
          <Link to="/items/1">Item Info</Link>
        </nav>

        <button type="button" className="primary-button" onClick={onLogout}>
          Sign out
        </button>
      </section>
    </main>
  )
}

export default HomePage
