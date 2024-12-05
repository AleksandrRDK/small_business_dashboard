import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBD0E6z6jEKQk2GuzqCm2xpXp-Q17zRlH4",
  authDomain: "small-business-dashboard.firebaseapp.com",
  projectId: "small-business-dashboard",
  storageBucket: "small-business-dashboard.appspot.com",
  messagingSenderId: "639799182453",
  appId: "1:639799182453:web:d01d08a8294cf46bec643c",
  measurementId: "G-TL3S074K13"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase Authentication instance
export const auth = getAuth(app);

export default app;
