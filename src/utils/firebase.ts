import { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// TODO: Add firebaseConfig and initialize the firebase app
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvZiYImQuoE0Xgz1oSYiFCEy-7FbOoatw",
  authDomain: "scrum-project-c5327.firebaseapp.com",
  databaseURL: "https://scrum-project-c5327.firebaseio.com",
  projectId: "scrum-project-c5327",
  storageBucket: "scrum-project-c5327.appspot.com",
  messagingSenderId: "835977624616",
  appId: "1:835977624616:web:68ada0111456899449c91d"
};

// inicializace
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
// Firestore database
const db = firebase.firestore();

/**
 * Sign in
 */
// Simplified user type for referencing users
type User = Pick<firebase.User, 'uid' | 'email'>;

// Helper to get current time in Timestamp
export const timestampNow = firebase.firestore.Timestamp.now;

// Hook providing logged in user information
export const useLoggedInUser = () => {
  // Hold user info in state
  const [user, setUser] = useState<firebase.User | null>();

  // Setup onAuthStateChanged once when component is mounted
  useEffect(() => {
    firebase.auth().onAuthStateChanged(u => setUser(u));
  }, []);

  return user;
};

// Sign up handler
export const signUp = (email: string, password: string) =>
  firebase.auth().createUserWithEmailAndPassword(email, password);

// Sign in handler
export const signIn = (email: string, password: string) =>
  firebase.auth().signInWithEmailAndPassword(email, password);

// Sign out handler
export const signOut = () => firebase.auth().signOut();
