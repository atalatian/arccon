import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA331vYeQ-dYnwgevGy6EJzY2HE46hBa0s",
    authDomain: "arccon-30445.firebaseapp.com",
    projectId: "arccon-30445",
    storageBucket: "arccon-30445.appspot.com",
    messagingSenderId: "437844122608",
    appId: "1:437844122608:web:d4b2b0e2da832b8a48db35",
    measurementId: "G-53RCK37ZN7",
};


const app = initializeApp(firebaseConfig);
const db = getFirestore();

export default db