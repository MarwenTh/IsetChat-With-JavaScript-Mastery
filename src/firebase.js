import firebase from "firebase/app";
import "firebase/auth";

export const auth = firebase //exporting the auth function
  .initializeApp({
    //initializing the firebase app
    apiKey: "AIzaSyBBNJlu4wpQk80AJ6ozyywmttGte30anH8",
    authDomain: "final-add42.firebaseapp.com",
    projectId: "final-add42",
    storageBucket: "final-add42.appspot.com",
    messagingSenderId: "625673380739",
    appId: "1:625673380739:web:42a79a8a5dacc6d3f38cb6",
  })
  .auth(); //exporting the auth function
