import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { listenForAuthChanges, logout } from './firebase'
import HomePage from './pages/HomePage'
import ItemInfoPage from './pages/ItemInfoPage'
import ItemsListPage from './pages/ItemsListPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import SignupPage from './pages/SignupPage'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = listenForAuthChanges((currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    setLoading(true)

    try {
      await logout()
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <main className="app-shell"><section className="auth-card"><p>Loading...</p></section></main>
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/signup" element={user ? <Navigate to="/" replace /> : <SignupPage />} />
      <Route path="/profile" element={user ? <ProfilePage user={user} /> : <Navigate to="/login" replace />} />
      <Route path="/items" element={user ? <ItemsListPage /> : <Navigate to="/login" replace />} />
      <Route path="/items/:id" element={user ? <ItemInfoPage /> : <Navigate to="/login" replace />} />
      <Route path="/" element={user ? <HomePage user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
