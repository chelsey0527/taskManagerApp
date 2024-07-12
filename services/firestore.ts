import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  increment,
  writeBatch,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import {db} from '../config/firebase-config';
import {Task} from '../types/task';
import {Leaderboard} from '../types/leaderboard';
import {UserInfo} from 'firebase/auth';

// <Profile>
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

// <Tasks>
// Function to get tasks for a user
export const getUserTasks = async (userId: string): Promise<Task[]> => {
  try {
    const tasks: Task[] = [];
    const q = query(collection(db, 'tasks'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(doc => {
      tasks.push({id: doc.id, ...doc.data()} as Task);
    });
    return tasks;
  } catch (error) {
    console.error('Error fetching tasks: ', error);
    throw error;
  }
};

// Function to add a task
export const addTask = async (task: Omit<Task, 'id'>) => {
  try {
    await addDoc(collection(db, 'tasks'), task);
  } catch (error) {
    console.error('Error adding task: ', error);
    throw error;
  }
};

// Function to update a task
export const updateTask = async (id: string, task: Partial<Task>) => {
  try {
    const taskRef = doc(db, 'tasks', id);
    await updateDoc(taskRef, task);
  } catch (error) {
    console.error('Error adding task: ', error);
    throw error;
  }
};

// Function to delete a task
export const deleteTask = async (id: string) => {
  try {
    const taskRef = doc(db, 'tasks', id);
    await deleteDoc(taskRef);
  } catch (error) {
    console.error('Error deleting task: ', error);
    throw error;
  }
};

// <Leaderboard>
// Function to update completion stats
const updateCompletionStats = async (userId: string, completed: boolean) => {
  try {
    const userStatsRef = doc(db, 'leaderboard', userId);
    const incrementValue = completed ? 1 : -1;

    // Fetch user's name using the getUserInfo function
    const userInfo = await getUserInfo(userId);

    if (!userInfo) {
      throw new Error(`No user found with userId: ${userId}`);
    }

    const docSnap = await getDoc(userStatsRef);

    if (docSnap.exists()) {
      // Update the document if it exists
      await updateDoc(userStatsRef, {
        dailyCount: increment(incrementValue),
        weeklyCount: increment(incrementValue),
        monthlyCount: increment(incrementValue),
      });
    } else {
      // Create the document if it does not exist
      await setDoc(userStatsRef, {
        userId,
        userInfo,
        dailyCount: completed ? 1 : 0,
        weeklyCount: completed ? 1 : 0,
        monthlyCount: completed ? 1 : 0,
      });
    }
  } catch (error) {
    console.error('Error updating completion stats: ', error);
    throw error;
  }
};

// Function to toggle task completion and update stats
export const toggleTaskCompletion = async (
  taskId: string,
  completed: boolean,
  userId: string,
) => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {completed});

    await updateCompletionStats(userId, completed);
  } catch (error) {
    console.error('Error toggling task completion: ', error);
    throw error;
  }
};

// Function to get the leaderboard
export const getLeaderboard = async (
  timePeriod: string,
): Promise<Leaderboard[]> => {
  try {
    const leaderboard: Leaderboard[] = [];
    const q = query(
      collection(db, 'leaderboard'),
      orderBy(timePeriod, 'desc'),
      limit(10),
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(doc => {
      leaderboard.push({userId: doc.id, ...doc.data()} as Leaderboard);
    });
    return leaderboard;
  } catch (error) {
    console.error('Error fetching leaderboard: ', error);
    throw error;
  }
};
