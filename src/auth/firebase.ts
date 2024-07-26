// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_API_KEY,
  authDomain: "project-management-react-a7ee1.firebaseapp.com",
  projectId: "project-management-react-a7ee1",
  storageBucket: import.meta.env.VITE_APP_STORAGE_BUCKET,
  messagingSenderId: "753135550672",
  appId: "1:753135550672:web:7ef1130c8cd4212a989ed5",
  measurementId: "G-YK73V2HV1D",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);
