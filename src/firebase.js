import firebase from "firebase/compat/app";
import 'firebase/compat/auth'
import 'firebase/compat/storage'
import 'firebase/compat/firestore'
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getStorage } from "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyD_D9Ew7toKsIA4NDUSo87VnAo3DqT6sic",
    authDomain: "moment-55cf8.firebaseapp.com",
    projectId: "moment-55cf8",
    storageBucket: "moment-55cf8.appspot.com",
    messagingSenderId: "845428944389",
    appId: "1:845428944389:web:4645a4894f2c8e11fcb66c"
  };
  
  // Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const auth = getAuth()
const storage = getStorage(app)

const db = app.firestore()

export {auth, db, storage}