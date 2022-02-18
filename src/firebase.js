// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from 'firebase/app'
import 'firebase/auth'
const firebaseConfig = {
    apiKey: "AIzaSyBdEfLrxJZlrzrG_O5py-qZdvli79d4buc",
    authDomain: "dialaway-65fc9.firebaseapp.com",
    projectId: "dialaway-65fc9",
    storageBucket: "dialaway-65fc9.appspot.com",
    messagingSenderId: "173723884462",
    appId: "1:173723884462:web:5608b0378a861156fcc63f",
    measurementId: "G-78YWSZFE8D"
  };
firebase.initializeApp(firebaseConfig)
const auth=firebase.auth()
export {auth}