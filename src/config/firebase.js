// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider } from "firebase/auth";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9s4tw-NyvyP-hyZNpnWyzlxohVf_eI-c",
  authDomain: "loginby-35c92.firebaseapp.com",
  projectId: "loginby-35c92",
  storageBucket: "loginby-35c92.appspot.com",
  messagingSenderId: "68370525483",
  appId: "1:68370525483:web:12ab07da9012c9f8bae96e",
  measurementId: "G-DCPN124NCP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);
export {provider}
export {storage}