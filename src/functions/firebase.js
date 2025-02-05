// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBujrpiFdISMTBzaG7s26GVI4wDmKBJzCc",
  authDomain: "nexavest-4c09f.firebaseapp.com",
  projectId: "nexavest-4c09f",
  storageBucket: "nexavest-4c09f.firebasestorage.app",
  messagingSenderId: "843145117098",
  appId: "1:843145117098:web:42d5adeaa43090a0917fd3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }