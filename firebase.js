// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDghfiCwjWyGC4e1Uxmx0LhJVKvyqNGrmI",
  authDomain: "instagram-clone-5397c.firebaseapp.com",
  projectId: "instagram-clone-5397c",
  storageBucket: "instagram-clone-5397c.appspot.com",
  messagingSenderId: "254359866852",
  appId: "1:254359866852:web:d5506cb05817a19eef0bf1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export default app;