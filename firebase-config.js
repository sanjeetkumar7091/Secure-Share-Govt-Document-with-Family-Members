import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

export const firebaseConfig = {
  apiKey: "AIzaSyCNlJ1xfRqLW1FUJTXMxjZ30mSYnx8HXkM",
  authDomain: "and-share-gov-document.firebaseapp.com",
  projectId: "and-share-gov-document",
  storageBucket: "and-share-gov-document.firebasestorage.app",
  messagingSenderId: "615789224638",
  appId: "1:615789224638:web:c397eb87eecba5149434ef"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase services references
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
