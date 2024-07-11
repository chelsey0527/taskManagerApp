import {collection, addDoc, getDocs, query, where} from 'firebase/firestore';
import {db} from '../config/firebase-config';
import {Task} from '../types/task';

// Function to add a task
export const addTask = async (task: Omit<Task, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'tasks'), task);
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

// Function to get tasks for a user
export const getUserTasks = async (userId: string): Promise<Task[]> => {
  const q = query(collection(db, 'tasks'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  const tasks: Task[] = [];
  querySnapshot.forEach(doc => {
    const taskData = doc.data() as Omit<Task, 'id'>;
    tasks.push({id: doc.id, ...taskData});
  });
  return tasks;
};
