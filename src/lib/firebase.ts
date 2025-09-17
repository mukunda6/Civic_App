
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  projectId: "studio-9884214501-3e117",
  appId: "1:943006094640:web:f15e92e46d66340ee0e4f5",
  storageBucket: "studio-9884214501-3e117.firebasestorage.app",
  apiKey: "AIzaSyAuSf90ZjT8tmeTKgre0I5CFGWKqs1E1cc",
  authDomain: "studio-9884214501-3e117.firebaseapp.com",
  messagingSenderId: "943006094640"
};


// Initialize Firebase
let firebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0];
}

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);

export { db, auth, storage, firebaseApp };
