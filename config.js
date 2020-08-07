import firebase from 'firebase';
require('@firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyBJfFyOn29IVwBPih5BCrlGaoo_BXPRvjg",
    authDomain: "bartersystemapp-18332.firebaseapp.com",
    databaseURL: "https://bartersystemapp-18332.firebaseio.com",
    projectId: "bartersystemapp-18332",
    storageBucket: "bartersystemapp-18332.appspot.com",
    messagingSenderId: "491044848010",
    appId: "1:491044848010:web:3b1a6027c2d8b9c9efc873"
  };

  firebase.initializeApp(firebaseConfig);
  export default firebase.firestore();