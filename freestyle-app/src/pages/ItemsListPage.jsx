import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore'
import { TRICKS_DATA } from '../data/tricksData'
import { db } from '../firebase'

const CATEGORY_OPTIONS = [
  { key: 'l', label: 'Lowers' },
  { key: 'u', label: 'Uppers' },
  { key: 's', label: 'Sitting' },
  { key: 'o', label: 'Other' },
]

function ItemsListPage({ user }) {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('l')
  const [masteredIds, setMasteredIds] = useState([])
  const [message, setMessage] = useState('')
  const filteredTricks = TRICKS_DATA.filter((trick) => trick.category === selectedCategory)

  useEffect(() => {
    const loadMasteredTricks = async () => {
      if (!user?.uid || !db) {
        return
      }

      try {
        const masteredSnapshot = await getDocs(collection(db, 'users', user.uid, 'masteredTricks'))
        setMasteredIds(masteredSnapshot.docs.map((item) => item.id))
      } catch (error) {
        console.error('Failed to load mastered tricks:', error)
        setMessage('Could not load mastered tricks. Check Firestore rules and auth.')
      }
    }

    loadMasteredTricks()
  }, [user])

  const toggleMastered = async (trickId, isMastered) => {
    if (!user?.uid || !db) {
      return
    }

    const masteredRef = doc(db, 'users', user.uid, 'masteredTricks', trickId)

    try {
      if (isMastered) {
        await setDoc(masteredRef, { id: trickId }, { merge: true })
        setMasteredIds((currentIds) => [...new Set([...currentIds, trickId])])
        return
      }

      await deleteDoc(masteredRef)
      setMasteredIds((currentIds) => currentIds.filter((id) => id !== trickId))
    } catch (error) {
      console.error('Failed to update mastered trick:', error)
      setMessage('Could not update mastered state. Check Firestore rules and auth.')
    }
  }

  return (
    <main className="app-shell">
      <section className="auth-card items-panel">
        <div className="items-header">
          <div>
            <p className="eyebrow">Trick library</p>
            <h1>Items List</h1>
          </div>
          <Link className="inline-link" to="/">Back to home</Link>
        </div>

        <div className="items-grid">
          {CATEGORY_OPTIONS.map((category) => (
            <button
              key={category.key}
              type="button"
              className={`category-tile ${selectedCategory === category.key ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.key)}
            >
              <span>{category.label}</span>
            </button>
          ))}
        </div>

        <div className="items-list-wrapper">
          <h2>{CATEGORY_OPTIONS.find((category) => category.key === selectedCategory)?.label}</h2>

          {message ? <p className="status-message">{message}</p> : null}

          {filteredTricks.length > 0 ? (
            <ul className="items-list">
              {filteredTricks.map((trick) => {
                const isMastered = masteredIds.includes(trick.id)

                return (
                  <li key={trick.id}>
                    <div className="trick-row-card">
                      <button
                        type="button"
                        className="trick-row"
                        onClick={() => navigate(`/items/${trick.id}`)}
                      >
                        <span>{trick.name}</span>
                        <small>{trick.requirements.length} requirement(s)</small>
                      </button>

                      <label className={`mastered-toggle ${isMastered ? 'active' : ''}`}>
                        <input
                          type="checkbox"
                          checked={isMastered}
                          onChange={(event) => toggleMastered(trick.id, event.target.checked)}
                        />
                        <span>{isMastered ? 'Mastered' : 'Not mastered'}</span>
                      </label>
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="helper-text">No tricks found in this category yet.</p>
          )}
        </div>
      </section>
    </main>
  )
}

export default ItemsListPage
