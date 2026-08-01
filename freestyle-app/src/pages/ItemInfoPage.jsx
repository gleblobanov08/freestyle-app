import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore'
import { TRICKS_DATA } from '../data/tricksData'
import { db } from '../firebase'

function ItemInfoPage({ user }) {
  const { id } = useParams()
  const trick = TRICKS_DATA.find((item) => item.id === id)
  const [isMastered, setIsMastered] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadMasteredStatus = async () => {
      if (!user?.uid || !db) {
        setIsMastered(false)
        return
      }

      try {
        const masteredSnapshot = await getDocs(collection(db, 'users', user.uid, 'masteredTricks'))
        const masteredIds = masteredSnapshot.docs.map((item) => item.id)
        setIsMastered(masteredIds.includes(id))
      } catch (error) {
        console.error('Failed to load mastered status:', error)
        setMessage('Could not load mastered state. Check Firestore rules and auth.')
      }
    }

    loadMasteredStatus()
  }, [id, user])

  const removeFromMastered = async () => {
    if (!user?.uid || !db || !trick) {
      return
    }

    try {
      await deleteDoc(doc(db, 'users', user.uid, 'masteredTricks', trick.id))
      setIsMastered(false)
    } catch (error) {
      console.error('Failed to remove mastered trick:', error)
      setMessage('Could not remove from mastered. Check Firestore rules and auth.')
    }
  }

  if (!trick) {
    return (
      <main className="app-shell">
        <section className="auth-card">
          <h1>Item not found</h1>
          <p className="helper-text">This trick could not be found.</p>
          <Link className="inline-link" to="/items">Back to list</Link>
        </section>
      </main>
    )
  }

  const requirementLinks = trick.requirements
    .map((requirementId) => ({
      id: requirementId,
      name: TRICKS_DATA.find((item) => item.id === requirementId)?.name || requirementId,
    }))
    .filter((requirement) => requirement.name)

  const addToMastered = async () => {
    if (!user?.uid || !db) {
      return
    }

    try {
      await setDoc(doc(db, 'users', user.uid, 'masteredTricks', trick.id), { id: trick.id }, { merge: true })
      setIsMastered(true)
      setMessage('')
    } catch (error) {
      console.error('Failed to add mastered trick:', error)
      setMessage('Could not mark as mastered. Check Firestore rules and auth.')
    }
  }

  return (
    <main className="app-shell">
      <section className="auth-card item-detail-panel">
        <div className="items-header">
          <div>
            <p className="eyebrow">Trick details</p>
            <h1>{trick.name}</h1>
          </div>
          <Link className="inline-link" to="/items">Back to list</Link>
        </div>

        <div className="detail-card">
          {message ? <p className="status-message">{message}</p> : null}

          <div className="detail-meta-row">
            <p><strong>Category:</strong> {trick.category}</p>
            <p><strong>ID:</strong> {trick.id}</p>
          </div>

          <div className="detail-actions">
            <span className={`mastered-badge ${isMastered ? 'visible' : ''}`}>
              {isMastered ? 'Mastered' : 'Not mastered'}
            </span>

            {isMastered ? (
              <button type="button" className="remove-mastered-button" onClick={removeFromMastered}>
                Remove from mastered
              </button>
            ) : (
              <button type="button" className="primary-button small-button" onClick={addToMastered}>
                Mark as mastered
              </button>
            )}
          </div>

          <div>
            <strong>Requirements:</strong>
            {requirementLinks.length > 0 ? (
              <ul className="requirement-list">
                {requirementLinks.map((requirement) => (
                  <li key={requirement.id}>
                    <Link className="inline-link" to={`/items/${requirement.id}`}>
                      {requirement.id}
                    </Link>
                    <span className="requirement-name">({requirement.name})</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="helper-text">No requirements for this trick.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

export default ItemInfoPage
