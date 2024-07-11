// src/config/firebase-config.ts
import {initializeApp, getApps} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getAuth, setPersistence, inMemoryPersistence} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
} from '@env';

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
};

console.log('Firebase Config:', firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication with AsyncStorage
const auth = getAuth(app);
setPersistence(auth, inMemoryPersistence)
  .then(() => {
    console.log('Firebase Auth persistence set to AsyncStorage');
  })
  .catch(error => {
    console.error('Error setting Firebase Auth persistence:', error);
  });

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export {auth, db};
