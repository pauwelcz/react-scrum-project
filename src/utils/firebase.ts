import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { useEffect, useState } from 'react';


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
export type User = Pick<firebase.User, 'uid' | 'email'>;
export type UserItem = {
  uid: string,
  email: string,
}
export const usersColection = db.collection('users') as firebase.firestore.CollectionReference<UserItem>;
export type UserRerefence = firebase.firestore.DocumentReference<UserItem>;
// Project
export type Project = {
  id: string;
  by: User;
  name: string;
  users: string[];
  note: string;
}
export const projectsCollection = db.collection('projects') as firebase.firestore.CollectionReference<Project>;
export type ProjectReference = firebase.firestore.DocumentReference<Project>;

// Category
export type Category = {
  id: string;
  by: User;
  color: string;
  project: string; // Project#id
  name: string;
}
export const categoriesCollection = db.collection('categories') as firebase.firestore.CollectionReference<Category>;
export type CategoryReference = firebase.firestore.DocumentReference<Category>;

// Task
export type Task = {
  id: string;
  by: User;
  name: string;
  category: string[]; // Category#id
  project: string;
  phase: string;
  note: string;
  order: number;
}
export const tasksCollection = db.collection('tasks') as firebase.firestore.CollectionReference<Task>;
export type TaskReference = firebase.firestore.DocumentReference<Task>;

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
  firebase.auth().createUserWithEmailAndPassword(email, password).then(user => {
    if (user.user?.email !== null) {
      db.collection("users").doc(user.user?.uid).set({
        uid: user.user?.uid,
        email: user.user?.email
      })
    }
  });

// Sign in handler
export const signIn = (email: string, password: string) =>
  firebase.auth().signInWithEmailAndPassword(email, password);

// Sign out handler
export const signOut = () => firebase.auth().signOut();

export const compareStrings = (a: string, b: string): number => {
  return (a > b) ? 1 : ((b > a) ? -1 : 0);
}