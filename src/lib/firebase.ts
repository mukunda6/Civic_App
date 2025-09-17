
import { initializeApp, getApps, getApp, FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyAuSf90ZjT8tmeTKgre0I5CFGWKqs1E1cc",
  authDomain: "studio-9884214501-3e117.firebaseapp.com",
  projectId: "studio-9884214501-3e117",
  storageBucket: "studio-9884214501-3e117.appspot.com",
  messagingSenderId: "943006094640",
  appId: "1:943006094640:web:f15e92e46d66340ee0e4f5",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage, app };
