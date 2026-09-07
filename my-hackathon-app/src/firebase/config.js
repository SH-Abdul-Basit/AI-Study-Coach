import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if credentials have been populated
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY" &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== "YOUR_PROJECT_ID"
);

if (!isFirebaseConfigured) {
  console.warn(
    "[Firebase] Notice: Firebase credentials are not yet configured in .env. Please provide your VITE_FIREBASE_* keys to connect to your live Firebase project."
  );
}

// Fallback config so the SDK initializes gracefully without crashing the app
const activeConfig = isFirebaseConfigured
  ? firebaseConfig
  : {
      apiKey: "AIzaSyDemoDummyKeyForAppInitialization12345",
      authDomain: "ai-study-coach-demo.firebaseapp.com",
      projectId: "ai-study-coach-demo",
      storageBucket: "ai-study-coach-demo.appspot.com",
      messagingSenderId: "123456789012",
      appId: "1:123456789012:web:demo1234567890abcdef",
    };

const app = !getApps().length ? initializeApp(activeConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
