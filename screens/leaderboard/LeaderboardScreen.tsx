import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {getLeaderboard} from '../../services/firestore';

type LeaderboardEntry = {
  userId: string;
  userInfo: {
    username: string;
  };
  dailyCount: number;
  weeklyCount: number;
  monthlyCount: number;
};

const LeaderboardScreen: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [timePeriod, setTimePeriod] = useState<
    'dailyCount' | 'weeklyCount' | 'monthlyCount'
  >('dailyCount');
  const isFocused = useIsFocused();

  const fetchLeaderboard = async () => {
    const data: LeaderboardEntry[] = await getLeaderboard(timePeriod);
    setLeaderboard(data);
  };

  useEffect(() => {
    console.log('set time period: ', timePeriod);
    fetchLeaderboard();
  }, [timePeriod]);

  useEffect(() => {
    if (isFocused) {
      fetchLeaderboard();
    }
  }, [isFocused]);

  const renderItem = ({
    item,
    index,
  }: {
    item: LeaderboardEntry;
    index: number;
  }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.rank}>{index + 1}</Text>
      <Text style={styles.username}>{item.userInfo.username}</Text>
      <Text style={styles.count}>{item[timePeriod]}</Text>
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
        contentContainerStyle={styles.listContainer}
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
    backgroundColor: 'salmon',
  },
  filterText: {
    color: 'white',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  rank: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
  count: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LeaderboardScreen;
