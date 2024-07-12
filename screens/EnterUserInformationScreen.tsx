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
import {validateRequiredField} from '../utils/validators';

type Props = StackScreenProps<RootStackParamList, 'EnterUserInformation'>;

const EnterUserInformationScreen: React.FC<Props> = ({route, navigation}) => {
  const {userId} = route.params;
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!validateRequiredField(username)) {
      setError('Username is required');
      return;
    }

    try {
      await saveUserInfo(userId, username);
      navigation.navigate('Main', {userId});
      setError('');
    } catch (error) {
      console.error('Error adding user information:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>User name</Text>
      <TextInput
        style={error ? styles.errorInput : styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <Text style={styles.error}>{error}</Text>
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
  errorInput: {
    height: 40,
    borderColor: '#D8451D',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingLeft: 8,
  },
  error: {
    color: '#D8451D',
    textAlign: 'center',
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
