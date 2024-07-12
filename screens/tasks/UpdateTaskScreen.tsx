import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../types/navigation';
import {updateTask} from '../../services/firestore/tasks';
import {validateRequiredField, validateDate} from '../../utils/validators';
import {Task} from '../../types/task';

type Props = StackScreenProps<RootStackParamList, 'UpdateTask'> & {
  userId: string;
  task: Object;
};

const UpdateTaskScreen: React.FC<Props> = ({route, navigation}) => {
  const {task, userId} = route.params;
  console.log(task);
  const [name, setName] = useState(task.name);
  const [category, setCategory] = useState(task.category);
  const [description, setDescription] = useState(task.description);
  const [deadline, setDeadline] = useState(
    new Date(task.deadline).toISOString().split('T')[0],
  );
  const [error, setError] = useState('');

  const handleUpdateTask = async () => {
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

    const updatedTask = {
      name,
      category,
      description,
      deadline: new Date(deadline).getTime(),
    };

    await updateTask(task.id, updatedTask);
    navigation.navigate('Tasks', {userId});
  };

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
      <TouchableOpacity style={styles.button} onPress={handleUpdateTask}>
        <Text style={styles.buttonText}>Update Task</Text>
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

export default UpdateTaskScreen;
