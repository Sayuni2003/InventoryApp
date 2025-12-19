// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8-PfedLxUZczlDkOm1kinrIAz1Outks0",
  authDomain: "inventoryapp-5e792.firebaseapp.com",
  projectId: "inventoryapp-5e792",
  storageBucket: "inventoryapp-5e792.firebasestorage.app",
  messagingSenderId: "11914398668",
  appId: "1:11914398668:web:f5651a35caf3f65e8a6b69",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app);
export default app;
