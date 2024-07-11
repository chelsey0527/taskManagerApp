import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../../screens/HomeScreen';
import TaskScreen from '../../screens/TaskScreen';
import LeaderboardScreen from '../../screens/LeaderboardScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import NewTaskScreen from '../../screens/NewTaskScreen';

const Tab = createBottomTabNavigator();

type BottomTabNavigatorProps = {
  userId: string;
  navigation: any;
};

const BottomTabNavigator: React.FC<BottomTabNavigatorProps> = ({
  userId,
  navigation,
}) => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Tasks') {
            iconName = 'list-outline';
          } else if (route.name === 'Leaderboard') {
            iconName = 'trophy-outline';
          } else if (route.name === 'Profile') {
            iconName = 'person-outline';
          } else if (route.name === 'New Task') {
            iconName = 'add-circle-outline';
            return (
              <Ionicons
                name={iconName}
                size={size}
                color={color}
                style={{marginBottom: -10}}
              />
            );
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: false,
      })}>
      <Tab.Screen name="Home">
        {props => <HomeScreen {...props} userId={userId} />}
      </Tab.Screen>
      <Tab.Screen name="Tasks">
        {props => <TaskScreen {...props} userId={userId} />}
      </Tab.Screen>
      <Tab.Screen
        name="New Task"
        options={{
          tabBarButton: props => (
            <TouchableOpacity {...props} style={styles.buttonAddTask}>
              <Ionicons name="add-circle" size={50} color="tomato" />
            </TouchableOpacity>
          ),
        }}>
        {props => <NewTaskScreen {...props} userId={userId} />}
      </Tab.Screen>
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Profile">
        {props => <ProfileScreen {...props} userId={userId} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  buttonAddTask: {
    // top: -20,
    // shadowColor: 'black',
    // shadowOpacity: 0.25,
    // shadowOffset: {width: 0, height: 10},
    // shadowRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 20,
  },
});

export default BottomTabNavigator;
