// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMXVtn_vuW2f2h8hj9dbeDESTGO-Mdr_c",
  authDomain: "doctor-app-7824e.firebaseapp.com",
  projectId: "doctor-app-7824e",
  storageBucket: "doctor-app-7824e.firebasestorage.app",
  messagingSenderId: "316984974562",
  appId: "1:316984974562:web:63a2f2c72bf2e97e6c12bb",
  measurementId: "G-F3KY3ZW861"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
//const analytics = getAnalytics(app);

export { db };