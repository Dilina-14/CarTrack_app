// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA8mfb-X8k6FZPcKPvuolLxm0A6HPfUkMQ",
  authDomain: "cartrack-69105.firebaseapp.com",
  projectId: "cartrack-69105",
  storageBucket: "cartrack-69105.firebasestorage.app",
  messagingSenderId: "947317634812",
  appId: "1:947317634812:web:5b4c66d30204cb9128c979",
  measurementId: "G-6QY4HPNW74"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
let analytics = null;

// Only initialize analytics on web platforms
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { auth, db, analytics };