import React, {useEffect, useState} from 'react';
import {SafeAreaView, ActivityIndicator, View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {onAuthStateChanged, User} from 'firebase/auth';
import SignUpScreen from './screens/SignUpScreen';
import SignInScreen from './screens/SignInScreen';
import TaskScreen from './screens/TaskScreen';
import {RootStackParamList} from './types/navigation';
import 'react-native-gesture-handler';
import {auth} from './config/firebase-config';
import CustomHeader from './components/CustomHeader';
import BottomTabNavigator from './components/navigation/BottomTabNavigator';

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={user ? 'Main' : 'SignIn'}>
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{
              header: ({navigation, route}) => (
                <CustomHeader routeName={route.name} />
              ),
            }}
          />
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{
              header: ({navigation, route}) => (
                <CustomHeader routeName={route.name} />
              ),
            }}
          />
          <Stack.Screen name="Main" options={{headerShown: false}}>
            {props => (
              <BottomTabNavigator {...props} userId={user?.uid || ''} />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;
