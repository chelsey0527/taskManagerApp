import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import {saveUserInfo} from '../services/firestore';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../types/navigation';

type Props = StackScreenProps<RootStackParamList, 'EnterUserInformation'>;

const EnterUserInformationScreen: React.FC<Props> = ({route, navigation}) => {
  const {userId} = route.params;
  const [username, setUsername] = useState('');

  const handleSave = async () => {
    if (!username) {
      alert('Username is required');
      return;
    }

    try {
      await saveUserInfo(userId, username);
      navigation.navigate('Main', {userId});
    } catch (error) {
      console.error('Error adding user information:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>User name</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Create</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  input: {
    height: 40,
    backgroundColor: 'white',
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 2,
    marginBottom: 12,
    paddingLeft: 8,
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

export default EnterUserInformationScreen;
