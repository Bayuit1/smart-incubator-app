import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// --- TAMBAHAN IMPOR UNTUK AUTHENTICATION & SESI PERSISTEN ---
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrTUyEE2UHtAJVTNWKdoy49TlIi39wr2k",
  authDomain: "endog-c90ac.firebaseapp.com",
  projectId: "endog-c90ac",
  storageBucket: "endog-c90ac.firebasestorage.app",
  messagingSenderId: "523794585455",
  appId: "1:523794585455:web:43ec6a41388f705d403a9a",
  measurementId: "G-7LLF2P996Y"
};

// Inisialisasi Firebase App
const app = initializeApp(firebaseConfig);

// Inisialisasi Firestore dan export
const db = getFirestore(app);

// Inisialisasi Firebase Auth Khusus React Native / Expo agar Auto-Login aktif
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Ekspor objek db dan auth untuk digunakan di screens lain
export { db, auth };