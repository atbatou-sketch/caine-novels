import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyATUNw0shETa5i97kElQPqHE21gHIooH-Q",
  authDomain: "caine-novels.firebaseapp.com",
  projectId: "caine-novels",
  storageBucket: "caine-novels.firebasestorage.app",
  messagingSenderId: "475596725683",
  appId: "1:475596725683:web:0c3d4df98d763021bc3fc6",
  measurementId: "G-CX497DMCT3"
};

// Initialize Firebase (Singleton pattern for Next.js SSR)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
