import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDiocvm13Xg8pVGkVaQ9Isnnn7KhPiVkxQ",
    authDomain: "learngrid-34206.firebaseapp.com",
    projectId: "learngrid-34206",
    storageBucket: "learngrid-34206.firebasestorage.app",
    messagingSenderId: "453858104058",
    appId: "1:453858104058:web:61f6cfb6ef7ce87b3d6f43"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
