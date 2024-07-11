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
} from 'firebase/firestore';
import {db} from '../config/firebase-config';
import {Task} from '../types/task';

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
