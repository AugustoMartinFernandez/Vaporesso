// src/credenciales.js
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDmMKFJc9Ti4KPhcu3T1yHK5QEFaM9jGpA",
  authDomain: "vaper-9c6a0.firebaseapp.com",
  projectId: "vaper-9c6a0",
  storageBucket: "vaper-9c6a0.appspot.com",
  messagingSenderId: "605800348867",
  appId: "1:605800348867:web:fe6bc0624ff4908d3f7676",
};

const appFirebase = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(appFirebase);
export const db = getFirestore(appFirebase);

export default appFirebase;


// CODIGO NO ACTUALIZADO