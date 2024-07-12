import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import {addTask} from '../../services/firestore';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../types/navigation';
import {validateRequiredField, validateDate} from '../../utils/validators';

type Props = StackScreenProps<RootStackParamList, 'NewTask'> & {
  userId: string;
};

const NewTaskScreen: React.FC<Props> = ({userId, route, navigation}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState('');

  const handleAddTask = async () => {
    if (
      !validateRequiredField(name) ||
      !validateRequiredField(category) ||
      !validateRequiredField(deadline)
    ) {
      setError('Name, category, and deadline are required');
      return;
    }

    if (!validateDate(deadline)) {
      setError('Please enter a valid deadline (YYYY-MM-DD)');
      return;
    }

    const newTask = {
      userId,
      name,
      category,
      description,
      createdTime: Date.now(),
      deadline: new Date(deadline).getTime(),
      completed: false,
    };
    await addTask(newTask);
    navigation.navigate('Tasks', {userId});
  };

  useEffect(() => {}, [userId, name, category, description, deadline, error]);

  return (
    <View style={styles.container}>
      <Text>Name</Text>
      <TextInput
        style={error ? styles.errorInput : styles.input}
        placeholder="Task Name"
        value={name}
        onChangeText={setName}
      />
      <Text>Category</Text>
      <TextInput
        style={error ? styles.errorInput : styles.input}
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />
      <Text>Description</Text>
      <TextInput
        style={error ? styles.errorInput : styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <Text>Deadline</Text>
      <TextInput
        style={error ? styles.errorInput : styles.input}
        placeholder="Deadline (YYYY-MM-DD)"
        value={deadline}
        onChangeText={setDeadline}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleAddTask}>
        <Text style={styles.buttonText}>Add new task</Text>
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
    backgroundColor: 'white',
    borderColor: '#D8451D',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 2,
    marginBottom: 12,
    paddingLeft: 8,
  },
  error: {
    color: 'red',
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

export default NewTaskScreen;
