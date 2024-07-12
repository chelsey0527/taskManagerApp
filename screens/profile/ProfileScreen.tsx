import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {signUserOut} from '../../services/auth';
import {getUserInfo} from '../../services/firestore';
import {UserInfo} from '../../types/userInfo';

const ProfileScreen: React.FC<{userId: string}> = ({userId, navigation}) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const handleSignOut = async () => {
    await signUserOut();
    navigation.navigate('SignIn');
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      const info = await getUserInfo(userId);
      setUserInfo(info);
    };

    fetchUserInfo();
  }, [userId]);

  if (!userInfo) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>name: {userInfo.username}</Text>
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    height: 40,
    backgroundColor: 'salmon',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    color: 'blue',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
});

export default ProfileScreen;
