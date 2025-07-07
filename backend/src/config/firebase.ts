import * as admin from "firebase-admin";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import dotenv from "dotenv";

dotenv.config();

// Firebase Client configuration (for authentication)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase Client App (for auth)
const clientApp = initializeApp(firebaseConfig);
export const clientAuth = getAuth(clientApp);
export const clientDb = getFirestore(clientApp);

// Initialize Firebase Admin (for token verification and admin operations)
let adminAuth: any = null;
let adminDb: any = null;

console.log('Initializing Firebase Admin...');
console.log('Project ID:', firebaseConfig.projectId);
console.log('Environment variables check:', {
  FIREBASE_API_KEY: !!process.env.FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: !!process.env.FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET: !!process.env.FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID: !!process.env.FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID: !!process.env.FIREBASE_APP_ID,
});

try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: firebaseConfig.projectId,
    });
  }
  adminAuth = admin.auth();
  adminDb = admin.firestore();
  console.log('Firebase Admin initialized successfully');
} catch (error: any) {
  console.error('Firebase Admin initialization failed:', error);
  console.error('Error details:', error.message);
  console.error('Stack trace:', error.stack);
  // Create mock objects to prevent crashes
  adminAuth = { verifyIdToken: () => Promise.reject(new Error('Admin not initialized')) };
  adminDb = {};
}

export { adminAuth, adminDb };
export default admin;