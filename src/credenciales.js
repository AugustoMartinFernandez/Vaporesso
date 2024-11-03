// src/credenciales.js
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Solo inicializa la app si no existe otra instancia
const appFirebase = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export default appFirebase;
