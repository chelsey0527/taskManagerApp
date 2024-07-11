// src/screens/TaskScreen.tsx
import React, {useEffect, useState} from 'react';
import {View, Text, Button} from 'react-native';
import {getUserTasks} from '../services/firestore';
import {signUserOut} from '../services/auth';
import {Task} from '../types/task';
import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../types/navigation';

type Props = StackScreenProps<RootStackParamList, 'Tasks'>;

const TaskScreen: React.FC<Props> = ({route, navigation}) => {
  const {userId} = route.params;
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const userTasks = await getUserTasks(userId);
      setTasks(userTasks);
    };

    fetchTasks();
  }, [userId]);

  const handleLogOut = async () => {
    await signUserOut();
    navigation.navigate('SignIn');
  };

  return (
    <View>
      <Button title="Log Out" onPress={handleLogOut} />
      {tasks.map(task => (
        <Text key={task.id}>{task.name}</Text>
      ))}
    </View>
  );
};

export default TaskScreen;
