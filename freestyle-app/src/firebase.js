import { initializeApp } from "firebase/app";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCbyaqdvaKDwIyXPjntW1wWi_Ui8EPwWKQ",
  authDomain: "freestyle-app-a1325.firebaseapp.com",
  projectId: "freestyle-app-a1325",
  storageBucket: "freestyle-app-a1325.firebasestorage.app",
  messagingSenderId: "217540979854",
  appId: "1:217540979854:web:3e70ad75b8bc154335eddf",
  measurementId: "G-H9NYDFD8CH"
};

const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean)
const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null
const auth = app ? getAuth(app) : null
const db = app ? getFirestore(app) : null

export const logout = async () => {
  if (!auth) {
    throw new Error('Firebase configuration is missing. Add your Firebase env values first.')
  }

  return signOut(auth)
}

export const listenForAuthChanges = (callback) => {
  if (!auth) {
    return () => {}
  }

  return onAuthStateChanged(auth, callback)
}

export const ensureUserProfileDocument = async (user, authProvider = 'login/password', usernameOverride = '') => {
  if (!db) {
    throw new Error('Firebase configuration is missing. Add your Firebase env values first.')
  }

  const normalizedProvider = authProvider === 'google' ? 'Google' : 'login/password'
  const username = usernameOverride?.trim() || user.displayName?.trim() || user.email?.split('@')[0] || ''

  await setDoc(
    doc(db, 'users', user.uid),
    {
      uid: user.uid,
      username,
      email: user.email || '',
      authProvider: normalizedProvider,
    },
    { merge: true }
  )
}

export { app, auth, db, isFirebaseConfigured };