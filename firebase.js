// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAsz6kAhzm8idHShg6HOtF4BxxfdEL-zRs",
    authDomain: "chat-app-vhmed.firebaseapp.com",
    projectId: "chat-app-vhmed",
    storageBucket: "chat-app-vhmed.firebasestorage.app",
    messagingSenderId: "866783972670",
    appId: "1:866783972670:web:44fea7503415608e47706f",
    measurementId: "G-J3L87X021N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth }