import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {signUserUp} from '../../services/auth';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../types/navigation';
import {
  validateEmail,
  validatePassword,
  validateRequiredField,
} from '../../utils/validators';

type Props = StackScreenProps<RootStackParamList, 'SignUp'>;

const SignUpScreen: React.FC<Props> = ({route, navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    try {
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

      const user = await signUserUp(email, password, navigation);
      setError('');
    } catch (e) {
      if (e.code == 'auth/invalid-email') {
        setError('Invalid email.');
      } else if (e.code == 'auth/weak-password') {
        setError('Password shorter than 6 characters.');
      } else if (e.code == 'auth/email-already-in-use') {
        setError('E-mail already been used.');
      }
    }
  };

  useEffect(() => {}, [email, password, error]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
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
      <Text style={styles.error}>{error}</Text>
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
        <Text style={styles.text}>or Sign in with your account</Text>
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

export default SignUpScreen;
