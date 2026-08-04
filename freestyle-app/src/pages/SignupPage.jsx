import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth'
import { auth, ensureUserProfileDocument, isFirebaseConfigured } from '../firebase'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegex = /^.{6,20}$/

function SignupPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    if (!emailRegex.test(email)) {
      setLoading(false)
      setMessage('Please enter a valid email address.')
      return
    }

    if (!passwordRegex.test(password)) {
      setLoading(false)
      setMessage('Password must be between 6 and 20 characters long.')
      return
    }

    try {
      if (!username.trim()) {
        throw new Error('Please enter a username to create your account.')
      }

      if (!auth) {
        throw new Error('Firebase configuration is missing. Add your Firebase env values first.')
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      await updateProfile(userCredential.user, { displayName: username.trim() })
      await ensureUserProfileDocument(userCredential.user, 'login/password', username)

      navigate('/')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setLoading(true)
    setMessage('')

    try {
      if (!auth) {
        throw new Error('Firebase configuration is missing. Add your Firebase env values first.')
      }

      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: 'select_account' })

      const userCredential = await signInWithPopup(auth, provider)
      await ensureUserProfileDocument(userCredential.user, 'google', userCredential.user.displayName)

      navigate('/')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="app-shell">
      <section className="auth-card">
        <div className="auth-header">
          <div className="branding">
            <span className="brand-mark">F</span>
            <div>
              <p className="eyebrow">Freestyle App</p>
              <h1>Create account</h1>
            </div>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>Username</span>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Choose a username"
              required
            />
          </label>

          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter a secure password"
              required
            />
          </label>

          <button type="submit" className="primary-button" disabled={loading || !isFirebaseConfigured}>
            {loading ? 'Please wait...' : 'Create account'}
          </button>
        </form>

        <div className="divider"><span>or continue with</span></div>

        <button type="button" className="google-button" onClick={handleGoogleAuth} disabled={loading || !isFirebaseConfigured}>
          Google sign in
        </button>

        <p className="inline-copy">
          Already have an account? <Link to="/login">Log in</Link>
        </p>

        {message ? <p className="status-message">{message}</p> : null}
      </section>
    </main>
  )
}

export default SignupPage
