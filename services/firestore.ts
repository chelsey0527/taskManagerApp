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
} from 'firebase/firestore';
import {db} from '../config/firebase-config';
import {Task} from '../types/task';
import {Leaderboard} from '../types/leaderboard';

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
    const userStatsRef = doc(db, 'users', userId, 'stats');
    const incrementValue = completed ? 1 : -1;

    await updateDoc(userStatsRef, {
      dailyCount: increment(incrementValue),
      weeklyCount: increment(incrementValue),
      monthlyCount: increment(incrementValue),
    });
  } catch (error) {
    console.error('Error deleting task: ', error);
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
    console.error('Error deleting task: ', error);
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
    console.log('-----', leaderboard);
    return leaderboard;
  } catch (error) {
    console.error('Error deleting task: ', error);
    throw error;
  }
};
