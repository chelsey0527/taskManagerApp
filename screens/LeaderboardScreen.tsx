import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {getLeaderboard} from '../services/firestore';

type LeaderboardEntry = {
  userId: string;
  completedTasks: number;
  username: string;
};

const LeaderboardScreen: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [timePeriod, setTimePeriod] = useState<
    'dailyCount' | 'weeklyCount' | 'monthlyCount'
  >('dailyCount');

  const fetchLeaderboard = async () => {
    const data = await getLeaderboard(timePeriod);
    setLeaderboard(data);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [timePeriod]);

  const renderItem = ({item}: {item: LeaderboardEntry}) => (
    <View style={styles.itemContainer}>
      <Text>{item.username}</Text>
      <Text>{item.completedTasks}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          onPress={() => setTimePeriod('dailyCount')}
          style={styles.filterButton}>
          <Text style={styles.filterText}>Daily</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTimePeriod('weeklyCount')}
          style={styles.filterButton}>
          <Text style={styles.filterText}>Weekly</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTimePeriod('monthlyCount')}
          style={styles.filterButton}>
          <Text style={styles.filterText}>Monthly</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={leaderboard}
        keyExtractor={item => item.userId}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  filterButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'tomato',
  },
  filterText: {
    color: 'white',
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default LeaderboardScreen;
