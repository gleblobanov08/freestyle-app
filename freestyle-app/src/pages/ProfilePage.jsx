import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { TRICKS_DATA } from '../data/tricksData'

const CATEGORY_LABELS = {
  l: 'Lowers',
  u: 'Uppers',
  s: 'Sitting',
  o: 'Other',
}

function ProfilePage({ user }) {
  const [masteredTricks, setMasteredTricks] = useState([])
  const [profileUsername, setProfileUsername] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.uid || !db) {
        setMasteredTricks([])
        setProfileUsername('')
        return
      }

      try {
        const profileSnapshot = await getDoc(doc(db, 'users', user.uid))
        const savedProfile = profileSnapshot.data() || {}
        const username = savedProfile.username?.trim()

        if (username) {
          setProfileUsername(username)
        } else {
          setProfileUsername(user.displayName?.trim() || user.email?.split('@')[0] || '')
        }

        const masteredSnapshot = await getDocs(collection(db, 'users', user.uid, 'masteredTricks'))
        const trickIds = masteredSnapshot.docs.map((item) => item.id)
        const trickDetails = TRICKS_DATA.filter((trick) => trickIds.includes(trick.id))

        setMasteredTricks(trickDetails)
      } catch (error) {
        console.error('Failed to load profile details:', error)
        setMessage('Could not load your profile details. Check Firestore rules and auth.')
        setProfileUsername(user.displayName?.trim() || user.email?.split('@')[0] || '')
      }
    }

    loadProfile()
  }, [user])

  const groupedMasteredTricks = Object.entries(CATEGORY_LABELS).map(([key, label]) => ({
    key,
    label,
    tricks: masteredTricks.filter((trick) => trick.category === key),
  }))

  return (
    <main className="app-shell">
      <section className="auth-card profile-panel">
        <div className="items-header">
          <div>
            <p className="eyebrow">Your profile</p>
            <h1>Profile</h1>
          </div>
          <Link className="inline-link" to="/">Back to home</Link>
        </div>

        <p className="helper-text">{profileUsername || user?.email || 'Google User'}</p>

        <div className="detail-card">
          <strong>Mastered</strong>

          {message ? <p className="status-message">{message}</p> : null}

          {masteredTricks.length > 0 ? (
            <div className="mastered-groups">
              {groupedMasteredTricks.map((group) => (
                <div key={group.key} className="mastered-group">
                  <h3>{group.label}</h3>
                  {group.tricks.length > 0 ? (
                    <ul className="requirement-list">
                      {group.tricks.map((trick) => (
                        <li key={trick.id}>
                          <span className="mastered-badge">Mastered</span>
                          <Link className="inline-link" to={`/items/${trick.id}`}>
                            <span>{trick.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="helper-text">No mastered tricks in this category.</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="helper-text">No mastered tricks yet.</p>
          )}
        </div>
      </section>
    </main>
  )
}

export default ProfilePage
