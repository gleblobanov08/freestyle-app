import { Link } from 'react-router-dom'

function ItemsListPage() {
  return (
    <main className="app-shell">
      <section className="auth-card">
        <h1>Items List</h1>
        <p className="helper-text">This page will list the available items.</p>
        <Link className="inline-link" to="/">Back to home</Link>
      </section>
    </main>
  )
}

export default ItemsListPage
