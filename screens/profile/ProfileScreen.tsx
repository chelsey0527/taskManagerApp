import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {signUserOut} from '../../services/auth';
import {getUserInfo} from '../../services/firestore';
import {UserInfo} from '../../types/userInfo';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
    return <ActivityIndicator size="large" color="salmon" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: userInfo.photoURL || 'https://via.placeholder.com/100',
          }}
          style={styles.profileImage}
        />
        <Text style={styles.username}>{userInfo.username}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('EditProfile', {userId})}>
          <Ionicons name="pencil-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 32,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    backgroundColor: 'salmon',
    borderRadius: 5,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    marginLeft: 8,
  },
});

export default ProfileScreen;
