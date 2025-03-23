// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

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
const storage = getStorage(app);
const database = getDatabase(app);

export { auth, db, app, database, storage };