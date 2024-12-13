import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import AuthContextProvider from "./context/Auth";
import { initializeApp } from "firebase/app";
import { enableIndexedDbPersistence, getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";
import { getFunctions } from "firebase/functions";
import { getAuth } from "firebase/auth";
import { getStorage, getDownloadURL, ref } from "firebase/storage";
import DataContextProvider from "./context/Data";

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
getMessaging(app);
getFunctions(app);
getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export async function getPngUrl(filePath: string) {
    try {
        const fileRef = ref(storage, filePath); // Path to the PNG file in your storage bucket
        const url = await getDownloadURL(fileRef);
        return url;
    } catch (error) {
        console.error("Error getting download URL:", error);
    }
}

enableIndexedDbPersistence(db).then(() => {
    const container = document.getElementById("root");
    const root = createRoot(container!);
    root.render(
        <React.StrictMode>
            <AuthContextProvider>
                <DataContextProvider>
                    <App />
                </DataContextProvider>
            </AuthContextProvider>
        </React.StrictMode>
    );

    serviceWorkerRegistration.register();
    reportWebVitals();
});
