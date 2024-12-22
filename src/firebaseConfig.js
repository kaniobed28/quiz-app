// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBPmA51SDnsH79qXr9Jrce0EQS3glEl2_g",
  authDomain: "camseltry.firebaseapp.com",
  projectId: "camseltry",
  storageBucket: "camseltry.appspot.com",
  messagingSenderId: "855349177144",
  appId: "1:855349177144:web:c1abd973da7201ae1eefcd",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
