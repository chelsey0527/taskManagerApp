import React, {useEffect, useState} from 'react';
import {View, Text, Button} from 'react-native';
// import {getUserTasks} from '../services/firestore';
// import {signUserOut} from '../services/auth';
// import {Task} from '../types/task';
// import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../types/navigation';

type Props = StackScreenProps<RootStackParamList, 'Tasks'>;

const LeaderboardScreen = () => {
  //   const {userId} = route.params;
  //   const [tasks, setTasks] = useState<Task[]>([]);

  //   useEffect(() => {
  //     const fetchTasks = async () => {
  //       const userTasks = await getUserTasks(userId);
  //       setTasks(userTasks);
  //     };

  //     fetchTasks();
  //   }, [userId]);

  return (
    <View>
      <Text>Leaderboard Screen</Text>
    </View>
  );
};

export default LeaderboardScreen;
