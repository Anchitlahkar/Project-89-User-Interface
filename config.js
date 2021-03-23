import firebase from 'firebase';
require('@firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyBMLXarEnv99u4nQpAlAJmmeOWLYBH5sRw",
    authDomain: "barter-system-a8877.firebaseapp.com",
    projectId: "barter-system-a8877",
    storageBucket: "barter-system-a8877.appspot.com",
    messagingSenderId: "401693330374",
    appId: "1:401693330374:web:8aa264681e9064188200c7"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

export default firebase.firestore()