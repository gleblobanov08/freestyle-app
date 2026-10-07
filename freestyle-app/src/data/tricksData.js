export const TRICKS_DATA = [
  {
    id: 'atw',
    category: 'l',
    name: 'Around the World',
    requirements: ['footstall'],
    videoUrl: 'https://www.youtube.com/watch?v=KbSVHJ1ZLbg',
  },
  {
    id: 'footstall',
    category: 'l',
    name: 'Foot Stall',
    requirements: [],
    videoUrl: 'https://www.youtube.com/watch?v=1V5-veUb7CI',
  },
  {
    id: 'heelflip',
    category: 'u',
    name: 'Heelflip',
    requirements: ['atw'],
    videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
  },
  {
    id: 'treflip',
    category: 's',
    name: 'Trey Flip',
    requirements: ['kickflip', 'shuvit'],
    videoUrl: 'https://www.youtube.com/watch?v=YQHsXMglC9A',
  },
  {
    id: 'ollie',
    category: 'o',
    name: 'Ollie',
    requirements: [],
    videoUrl: 'https://www.youtube.com/watch?v=hT_nvWreIhg',
  },
  {
    id: 'frontside-180',
    category: 'l',
    name: 'Frontside 180',
    requirements: ['ollie'],
    videoUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
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
        videoUrl: trick.videoUrl,
      }, { merge: true })
    )
  )
}
