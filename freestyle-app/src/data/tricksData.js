export const TRICKS_DATA = [
  {
    id: 'kickflip',
    category: 'u',
    name: 'Kickflip',
    requirements: ['shuvit'],
  },
  {
    id: 'shuvit',
    category: 's',
    name: 'Shuvit',
    requirements: [],
  },
  {
    id: 'heelflip',
    category: 'u',
    name: 'Heelflip',
    requirements: ['kickflip'],
  },
  {
    id: 'treflip',
    category: 'u',
    name: 'Trey Flip',
    requirements: ['kickflip', 'shuvit'],
  },
  {
    id: 'ollie',
    category: 'o',
    name: 'Ollie',
    requirements: [],
  },
  {
    id: 'frontside-180',
    category: 'l',
    name: 'Frontside 180',
    requirements: ['ollie'],
  },
]

export const seedTricksCollection = async (db) => {
  if (!db) {
    throw new Error('Firestore is not configured.')
  }

  const { doc, setDoc } = await import('firebase/firestore')

  await Promise.all(
    TRICKS_DATA.map((trick) =>
      setDoc(doc(db, 'tricks', trick.id), {
        id: trick.id,
        category: trick.category,
        name: trick.name,
        requirements: trick.requirements,
      }, { merge: true })
    )
  )
}
