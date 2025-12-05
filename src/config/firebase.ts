import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore/lite';
import { getStorage } from 'firebase/storage';

// Helper to safely access environment variables
const getEnv = (key: string) => {
  try {
    // Check import.meta.env (Vite)
    if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
      return (import.meta as any).env[key];
    }
  } catch (e) {
    // Ignore error
  }

  try {
    // Check process.env (Standard/Webpack/Node)
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch (e) {
    // Ignore error
  }

  return undefined;
};

const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY'),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('VITE_FIREBASE_APP_ID')
};

// Debugging: Validate configuration
const missingKeys = Object.entries(firebaseConfig)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingKeys.length > 0) {
  console.error(`Firebase Config Error: Missing keys: ${missingKeys.join(', ')}`);
} else {
  console.log('Firebase config loaded.');
}

// Initialize Firebase only if not already initialized
let app: FirebaseApp;

try {
  if (getApps().length === 0) {
    // Only initialize if we have a config, otherwise firebase throws hard
    if (firebaseConfig.apiKey) {
      app = initializeApp(firebaseConfig);
    } else {
      console.warn("Skipping Firebase initialization due to missing API Key.");
    }
  } else {
    app = getApps()[0];
  }
} catch (err) {
  console.error("Firebase initialization failed:", err);
}

// Export services. If app is undefined, these will likely be unusable.
// We export safe fallbacks or let them throw on usage, but we prevented the module-level crash.
export const auth = app! ? getAuth(app) : {} as any;
export const db = app! ? getFirestore(app) : {} as any;
export const storage = app! ? getStorage(app) : {} as any;

export default app!;