import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View, Text, StyleSheet} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {
  getUserInfo,
  getUserTasks,
  getIncompleteTasksCount,
} from '../services/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProgressBar from 'react-native-progress/Bar';

type Props = {
  userId: string;
};

const HomeScreen: React.FC<Props> = ({userId}) => {
  const [username, setUsername] = useState<string | null>(null);
  const [incompleteTasksCount, setIncompleteTasksCount] = useState<
    number | null
  >(null);
  const [completedTasksCount, setCompletedTasksCount] = useState<number | null>(
    null,
  );
  const isFocused = useIsFocused();

  const fetchHomeData = async () => {
    try {
      const user = await getUserInfo(userId);
      const incompleteTasks = await getIncompleteTasksCount(userId);
      const allTasks = await getUserTasks(userId);
      const completedTasks = allTasks.filter(task => task.completed).length;

      setUsername(user?.username || null);
      setIncompleteTasksCount(incompleteTasks);
      setCompletedTasksCount(completedTasks);
    } catch (error) {
      console.error('Error fetching home data:', error);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, [userId]);

  useEffect(() => {
    if (isFocused) {
      fetchHomeData();
    }
  }, [isFocused]);

  const completionRate =
    completedTasksCount !== null && incompleteTasksCount !== null
      ? completedTasksCount / (completedTasksCount + incompleteTasksCount)
      : 0;

  return (
    <View style={styles.container}>
      {username && incompleteTasksCount !== null ? (
        <View style={styles.content}>
          <View style={styles.welcomeBanner}>
            <Text style={styles.welcomeText}>Hi {username}! </Text>
            <Ionicons name="happy-outline" size={30} color="white" />
          </View>
          <View style={styles.taskCountCard}>
            <Text style={styles.taskCountText}>
              You have {incompleteTasksCount} incomplete{' '}
              {incompleteTasksCount <= 1 ? 'task' : 'tasks'}.
            </Text>
          </View>
          <View style={styles.upcomingTaskCard}>
            <Text style={styles.upcomingTaskText}>Completion Rate </Text>
            <ProgressBar progress={completionRate} width={200} color="salmon" />
          </View>
        </View>
      ) : (
        <ActivityIndicator size="large" color="salmon" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  content: {
    width: '90%',
    alignItems: 'center',
  },
  welcomeBanner: {
    width: '100%',
    backgroundColor: 'salmon',
    borderRadius: 10,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  taskCountCard: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskCountText: {
    fontSize: 18,
    color: '#333',
  },
  upcomingTaskCard: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  upcomingTaskText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
});

export default HomeScreen;
