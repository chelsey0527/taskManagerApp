import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {useIsFocused} from '@react-navigation/native';
import {
  getUserTasks,
  deleteTask,
  toggleTaskCompletion,
} from '../services/firestore';
import {RootStackParamList} from '../types/navigation';
import {Task} from '../types/task';

type Props = StackScreenProps<RootStackParamList, 'Tasks'> & {
  userId: string;
};

const TaskScreen: React.FC<Props> = ({userId, route, navigation}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const isFocused = useIsFocused();

  const fetchTasks = async () => {
    const userTasks = await getUserTasks(userId);
    setTasks(userTasks);
  };

  useEffect(() => {
    fetchTasks();
  }, [userId]);

  useEffect(() => {
    if (isFocused) {
      fetchTasks();
    }
  }, [isFocused]);

  const toggleComplete = async (task: Task) => {
    await toggleTaskCompletion(task.id, !task.completed, userId);
    fetchTasks();
  };

  const handleUpdate = (task: Task) => {
    navigation.navigate('UpdateTask', {task, userId});
  };

  const handleDelete = async (id: string) => {
    await deleteTask(id);
    const updatedTasks = await getUserTasks(userId);
    setTasks(updatedTasks);
  };

  const renderItem = ({item}: {item: Task}) => (
    <View style={styles.taskContainer}>
      <View style={styles.taskInfo}>
        <View style={styles.taskCheckbox}>
          <TouchableOpacity onPress={() => toggleComplete(item)}>
            <View style={item.completed ? styles.checked : styles.unchecked} />
          </TouchableOpacity>
        </View>
        <View style={styles.taskDetails}>
          <Text style={styles.taskName}>{item.name}</Text>
          <View style={styles.taskMeta}>
            <Text style={styles.taskCategory}>{item.category}</Text>
            <Text style={styles.taskDate}>
              {new Date(item.deadline).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => handleUpdate(item)}>
          <Text style={styles.deleteButton}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Text style={styles.deleteButton}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingTop: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  taskContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskCheckbox: {
    marginRight: 12,
  },
  unchecked: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  checked: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'tomato',
  },
  taskDetails: {
    flexDirection: 'column',
  },
  taskName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskCategory: {
    marginRight: 8,
    color: '#777',
  },
  taskDate: {
    color: '#777',
  },
  deleteButton: {
    color: 'tomato',
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});

export default TaskScreen;
