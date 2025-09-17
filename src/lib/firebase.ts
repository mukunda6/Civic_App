
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    projectId: "studio-9884214501-3e117",
    appId: "1:943006094640:web:f15e92e46d66340ee0e4f5",
    storageBucket: "studio-9884214501-3e117.firebasestorage.app",
    apiKey: "AIzaSyAuSf90ZjT8tmeTKgre0I5CFGWKqs1E1cc",
    authDomain: "studio-9884214501-3e117.firebaseapp.com",
    messagingSenderId: "943006094640",
};

// Initialize Firebase
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const db = getFirestore(firebaseApp);

export { firebaseApp, db };
