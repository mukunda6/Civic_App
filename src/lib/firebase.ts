
import { initializeApp, getApps, getApp, FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// This is a mock configuration and is not used in the demo.
// In a real application, you would replace this with your actual
// Firebase project configuration.
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyAuSf90ZjT8tmeTKgre0I5CFGWKqs1E1cc",
  authDomain: "studio-9884214501-3e117.firebaseapp.com",
  projectId: "studio-9884214501-3e117",
  storageBucket: "studio-9884214501-3e117.appspot.com",
  messagingSenderId: "943006094640",
  appId: "1:943006094640:web:f15e92e46d66340ee0e4f5",
};

// These are mock instances and do not connect to a real Firebase backend.
const app = {};
const db = {};
const auth = {};
const storage = {};

export { db, auth, storage, app };
