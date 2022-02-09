// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDT3lkF3PrL1PeykpouOdi_cq7bjUh_lBk",
  authDomain: "csc5356-milestone1.firebaseapp.com",
  projectId: "csc5356-milestone1",
  storageBucket: "csc5356-milestone1.appspot.com",
  messagingSenderId: "78775062001",
  appId: "1:78775062001:web:01a3609e445269540d0850",
  measurementId: "G-CSWH6QJ65W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);