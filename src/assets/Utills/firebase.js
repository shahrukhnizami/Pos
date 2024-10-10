// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyARhky7ty6KtK0qTjfjZwvqCiDYpPOogSo",
    authDomain: "ecommerce-be2dc.firebaseapp.com",
    projectId: "ecommerce-be2dc",
    storageBucket: "ecommerce-be2dc.appspot.com",
    messagingSenderId: "179775344953",
    appId: "1:179775344953:web:ebf1ab5b690f4cf96358e8",
    measurementId: "G-04F0FVEDJZ"
  };



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
// console.log("storagee",storage);



export{
   
    app,
    auth,
    storage,
    db
}
