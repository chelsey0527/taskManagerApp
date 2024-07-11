import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {auth} from '../config/firebase-config';

// Function to sign up user
export const signUserUp = async (
  email: string,
  password: string,
  navigation: any,
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    navigation.navigate('EnterUserInformation', {userId: user.uid});
    return user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error('Error signing up:', errorCode, errorMessage);
    throw error;
  }
};

// Function to sign in user
export const signUserIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;
    return user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error('Error signing in:', errorCode, errorMessage);
    throw error;
  }
};

// Function to sign out user
export const signUserOut = async () => {
  try {
    await signOut(auth);
    console.log('User signed out');
  } catch (error) {
    console.error('Error signing out: ', error);
    throw error;
  }
};
