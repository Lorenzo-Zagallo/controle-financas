import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB5whjTFTeEGAbrltm8d-TtrGn_c0VU7DI",
  authDomain: "controle-financas-2d962.firebaseapp.com",
  projectId: "controle-financas-2d962",
  storageBucket: "controle-financas-2d962.firebasestorage.app",
  messagingSenderId: "295368704824",
  appId: "1:295368704824:web:77c87517d212a5317977cd",
  measurementId: "G-KEES76X5GT"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);