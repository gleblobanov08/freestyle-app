import { Link } from 'react-router-dom'

function ItemInfoPage() {
  return (
    <main className="app-shell">
      <section className="auth-card">
        <h1>Item Info</h1>
        <p className="helper-text">This page will show item details.</p>
        <Link className="inline-link" to="/">Back to home</Link>
      </section>
    </main>
  )
}

export default ItemInfoPage
