// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC8OfxjEPqyNeNQptnraI05dWZbKZEHidU",
    authDomain: "uploadskinphoto.firebaseapp.com",
    projectId: "uploadskinphoto",
    storageBucket: "uploadskinphoto.appspot.com",
    messagingSenderId: "850993360332",
    appId: "1:850993360332:web:56bf0d47b84e341f104169"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);