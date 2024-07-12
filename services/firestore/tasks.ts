import {db} from '../../config/firebase-config';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  increment,
} from 'firebase/firestore';
import {Task} from '../../types/task';

// Function to get tasks for a user
export const getUserTasks = async (userId: string): Promise<Task[]> => {
  try {
    const tasks: Task[] = [];
    const q = query(collection(db, 'tasks'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(doc => {
      tasks.push({id: doc.id, ...doc.data()} as Task);
    });

    tasks.sort((a, b) => {
      if (a.completed === b.completed) {
        return a.deadline - b.deadline;
      }
      return a.completed ? 1 : -1;
    });

    return tasks;
  } catch (error) {
    console.error('Error fetching tasks: ', error);
    throw error;
  }
};

// Function to get incomplete tasks count for a user
export const getIncompleteTasksCount = async (
  userId: string,
): Promise<number> => {
  try {
    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', userId),
      where('completed', '==', false),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error('Error fetching incomplete tasks count: ', error);
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
    console.error('Error updating task: ', error);
    throw error;
  }
};

// Helper function to update leaderboard
const updateLeaderboardOnTaskChange = async (
  userId: string,
  task: Task,
  isTaskDeleted: boolean,
) => {
  try {
    const leaderboardRef = doc(db, 'leaderboard', userId);
    const incrementValue = isTaskDeleted ? -1 : 1;
    const now = new Date().getTime();
    const taskDeadline = new Date(task.deadline).getTime();

    const updates: any = {};
    if (taskDeadline >= getStartOfPeriod('day')) {
      updates.dailyCount = increment(incrementValue);
    }
    if (taskDeadline >= getStartOfPeriod('week')) {
      updates.weeklyCount = increment(incrementValue);
    }
    if (taskDeadline >= getStartOfPeriod('month')) {
      updates.monthlyCount = increment(incrementValue);
    }

    await updateDoc(leaderboardRef, updates);
  } catch (error) {
    console.error('Error updating leaderboard: ', error);
    throw error;
  }
};

// Helper function to get the start of the period
const getStartOfPeriod = (period: 'day' | 'week' | 'month') => {
  const now = new Date();
  if (period === 'day') {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  } else if (period === 'week') {
    const firstDayOfWeek = now.getDate() - now.getDay();
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      firstDayOfWeek,
    ).getTime();
  } else if (period === 'month') {
    return new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  }
  return now.getTime();
};

// Function to delete a task
export const deleteTask = async (id: string, userId: string) => {
  try {
    const taskRef = doc(db, 'tasks', id);
    const taskDoc = await getDoc(taskRef);

    if (!taskDoc.exists()) {
      throw new Error('Task not found');
    }

    const taskData = taskDoc.data() as Task;

    await deleteDoc(taskRef);
    await updateLeaderboardOnTaskChange(userId, taskData, true);
  } catch (error) {
    console.error('Error deleting task: ', error);
    throw error;
  }
};
