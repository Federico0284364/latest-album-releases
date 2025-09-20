// firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDrkQW2qg7s6XVayHq4FdqmO4ZZf8o3FJ0",
  authDomain: "album-tracker-30dfc.firebaseapp.com",
  projectId: "album-tracker-30dfc",
  storageBucket: "album-tracker-30dfc.appspot.com",
  messagingSenderId: "462568715743",
  appId: "1:462568715743:web:1736b71e6542f2ed42406a",
  measurementId: "G-2DCL5KKTXM",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});
const db = getFirestore(app);

export { db, auth, provider, signInWithPopup, signOut };
