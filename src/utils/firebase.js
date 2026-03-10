// ============================================================
// Firebase Configuration — Shared Leaderboard
// ============================================================
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA7Qx5gHOb-Q0os3J3sc2Y4oPhzIYQwhFQ",
  authDomain: "missile-defense-41ed4.firebaseapp.com",
  projectId: "missile-defense-41ed4",
  storageBucket: "missile-defense-41ed4.firebasestorage.app",
  messagingSenderId: "731692630243",
  appId: "1:731692630243:web:eb54a3e6dadaa953d605d6",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
