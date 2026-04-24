import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCKb2qL49MnFkSakZiidO3g7GhIFxv3MKU",
  authDomain: "gen-lang-client-0764402913.firebaseapp.com",
  projectId: "gen-lang-client-0764402913",
  storageBucket: "gen-lang-client-0764402913.firebasestorage.app",
  messagingSenderId: "815964786562",
  appId: "1:815964786562:web:e8b7efd6a429a0ffd6499b"
};

const app = initializeApp(firebaseConfig);

// Base de données nommée (non-default)
export const db = getFirestore(app, "ai-studio-469b45b3-ddc0-4c8a-9d44-563700ba9c68");
