import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDpVaZmx-DKzTeXHULCLQfEino6DxVRpO0",
  authDomain: "your-table-73390.firebaseapp.com",
  projectId: "your-table-73390",
  storageBucket: "your-table-73390.firebasestorage.app",
  messagingSenderId: "752139396334",
  appId: "1:752139396334:web:7e81ddd978230edf0d3fff"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {app, db, auth};