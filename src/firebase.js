// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCIYZXGn4kfXl25XH_sxFEfdMuFBovCEF0",
  authDomain: "city-explorer-3ba76.firebaseapp.com",
  projectId: "city-explorer-3ba76",
  storageBucket: "city-explorer-3ba76.firebasestorage.app",
  messagingSenderId: "311304860455",
  appId: "1:311304860455:web:897e3e33364c5560d82f02"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const AVIATIONSTACK_API_KEY = "986be164f46bc853f8015318e413de4a";