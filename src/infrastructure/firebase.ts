import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAPrg2Gz8mvA2nhXdszIhFqSbEsiXkjQmM",
  authDomain: "dating-matcher-hk.firebaseapp.com",
  projectId: "dating-matcher-hk",
  storageBucket: "dating-matcher-hk.firebasestorage.app",
  messagingSenderId: "292586094773",
  appId: "1:292586094773:web:1aa5f4a43b396a8ee1fefc",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
