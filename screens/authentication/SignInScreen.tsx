import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {signUserIn} from '../../services/auth';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../types/navigation';
import {
  validateEmail,
  validatePassword,
  validateRequiredField,
} from '../../utils/validators';

type Props = StackScreenProps<RootStackParamList, 'SignIn'>;

const LogInScreen: React.FC<Props> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    if (!validateRequiredField(email) || !validateRequiredField(password)) {
      setError('Email and password are required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      if (!email || !password) {
        setError('Email and password are required');
        return;
      }
      console.log('Attempting to sign in with email:', email, ' ', password);
      const user = await signUserIn(email, password);
      setError('');
      if (user) {
        navigation.navigate('Main', {userId: user?.uid});
      }
    } catch (e) {
      if (e.code === 'auth/invalid-credential') {
        setError('Incorreact e-mail or password.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        style={error ? styles.errorInput : styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={error ? styles.errorInput : styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Text style={styles.error}>{error ? error : ''}</Text>
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.text}>or Sign Up for free</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 5,
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
  text: {
    marginTop: 10,
    textAlign: 'center',
  },
});

export default LogInScreen;
