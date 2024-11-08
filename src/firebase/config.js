// firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDmMKFJc9Ti4KPhcu3T1yHK5QEFaM9jGpA",
  authDomain: "vaper-9c6a0.firebaseapp.com",
  projectId: "vaper-9c6a0",
  storageBucket: "vaper-9c6a0.appspot.com",
  messagingSenderId: "605800348867",
  appId: "1:605800348867:web:fe6bc0624ff4908d3f7676",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta la instancia de Firestore
export const db = getFirestore(app);

// CODIGO NO ACTUALIZADO
