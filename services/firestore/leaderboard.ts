import {db} from '../../config/firebase-config';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  increment,
  updateDoc,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import {Task} from '../../types/task';
import {Leaderboard} from '../../types/leaderboard';
import {getUserInfo} from './profile';

// Helper function to get start of the day, week, and month
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

// Function to update completion stats
const updateCompletionStats = async (
  userId: string,
  task: Task,
  completed: boolean,
) => {
  try {
    const userStatsRef = doc(db, 'leaderboard', userId);
    const incrementValue = completed ? 1 : -1;
    const now = new Date().getTime();
    const dailyStart = getStartOfPeriod('day');
    const weeklyStart = getStartOfPeriod('week');
    const monthlyStart = getStartOfPeriod('month');

    // Fetch user's name from the users' collection
    const userSnap = await getUserInfo(userId);

    if (!userSnap) {
      throw new Error(`No user found with userId: ${userId}`);
    }

    const {username} = userSnap;

    const docSnap = await getDoc(userStatsRef);
    if (docSnap.exists()) {
      const updates: any = {};

      if (task.deadline >= dailyStart) {
        updates.dailyCount = increment(incrementValue);
      }
      if (task.deadline >= weeklyStart) {
        updates.weeklyCount = increment(incrementValue);
      }
      if (task.deadline >= monthlyStart) {
        updates.monthlyCount = increment(incrementValue);
      }

      await updateDoc(userStatsRef, updates);
    } else {
      await setDoc(userStatsRef, {
        userId: userId,
        userName: username,
        dailyCount: task.deadline >= dailyStart ? incrementValue : 0,
        weeklyCount: task.deadline >= weeklyStart ? incrementValue : 0,
        monthlyCount: task.deadline >= monthlyStart ? incrementValue : 0,
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

    const taskDoc = await getDoc(taskRef);
    const task = taskDoc.data() as Task;

    await updateCompletionStats(userId, task, completed);
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
