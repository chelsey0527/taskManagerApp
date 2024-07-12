import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {getUserInfo, getIncompleteTasksCount} from '../services/firestore';

type Props = {
  userId: string;
};

const HomeScreen: React.FC<Props> = ({userId}) => {
  const [username, setUsername] = useState<string | null>(null);
  const [incompleteTasksCount, setIncompleteTasksCount] = useState<
    number | null
  >(null);
  const isFocused = useIsFocused();

  const fetchHomeData = async () => {
    try {
      const user = await getUserInfo(userId);
      const incompleteTasks = await getIncompleteTasksCount(userId);

      console.log(user);
      setUsername(user?.username || null);
      setIncompleteTasksCount(incompleteTasks);
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

  return (
    <View style={styles.container}>
      {username && incompleteTasksCount !== null ? (
        <Text>
          Hi {username}! You have {incompleteTasksCount}{' '}
          {incompleteTasksCount <= 1 ? 'task' : 'tasks'} incomplete!
        </Text>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
