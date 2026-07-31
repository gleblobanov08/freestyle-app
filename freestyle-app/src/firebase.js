import { initializeApp } from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCbyaqdvaKDwIyXPjntW1wWi_Ui8EPwWKQ",
  authDomain: "freestyle-app-a1325.firebaseapp.com",
  projectId: "freestyle-app-a1325",
  storageBucket: "freestyle-app-a1325.firebasestorage.app",
  messagingSenderId: "217540979854",
  appId: "1:217540979854:web:3e70ad75b8bc154335eddf",
  measurementId: "G-H9NYDFD8CH"
};

// Initialize Firebase
const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean)
const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null
const auth = app ? getAuth(app) : null
const googleProvider = auth ? new GoogleAuthProvider() : null

if (googleProvider) {
  googleProvider.setCustomParameters({ prompt: 'select_account' })
}

export const signInWithGoogle = async () => {
  if (!auth || !googleProvider) {
    throw new Error('Firebase configuration is missing. Add your Firebase env values first.')
  }

  return signInWithPopup(auth, googleProvider)
}

export const createAccount = async (email, password, username) => {
  if (!auth) {
    throw new Error('Firebase configuration is missing. Add your Firebase env values first.')
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email, password)

  if (username?.trim()) {
    await updateProfile(userCredential.user, { displayName: username.trim() })
  }

  return userCredential
}

export const loginWithEmail = async (email, password) => {
  if (!auth) {
    throw new Error('Firebase configuration is missing. Add your Firebase env values first.')
  }

  return signInWithEmailAndPassword(auth, email, password)
}

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

export { app, auth, googleProvider, isFirebaseConfigured }
