import {db} from '../../config/firebase-config';
import {collection, getDocs, query, where, addDoc} from 'firebase/firestore';
import {UserInfo} from 'firebase/auth';

// Function to save user information
export const getUserInfo = async (userId: string): Promise<UserInfo | null> => {
  try {
    const q = query(collection(db, 'users'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data() as UserInfo;
      return {id: doc.id, ...data};
    } else {
      console.log('No user found with the given ID');
      return null;
    }
  } catch (error) {
    console.error('Error fetching userInfo: ', error);
    throw error;
  }
};

export const saveUserInfo = async (userId: string, username: string) => {
  try {
    const userRef = await addDoc(collection(db, 'users'), {
      userId,
      username,
    });

    // Initialize leaderboard entry for the new user
    await addDoc(collection(db, 'leaderboard'), {
      userId,
      username,
      dailyCount: 0,
      weeklyCount: 0,
      monthlyCount: 0,
    });

    return userRef;
  } catch (error) {
    console.error('Error adding user information:', error);
    throw error;
  }
};
