import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
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
  const [modalVisible, setModalVisible] = useState(false);
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

  const timePeriodOptions = [
    {label: 'Daily', value: 'dailyCount'},
    {label: 'Weekly', value: 'weeklyCount'},
    {label: 'Monthly', value: 'monthlyCount'},
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.dropdownText}>
          Time period:{' '}
          {timePeriodOptions.find(option => option.value === timePeriod)?.label}
        </Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            {timePeriodOptions.map(option => (
              <TouchableOpacity
                key={option.value}
                style={styles.modalItem}
                onPress={() => {
                  setTimePeriod(option.value);
                  setModalVisible(false);
                }}>
                <Text style={styles.modalItemText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {leaderboard.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyContainerText}>No record.</Text>
          <Text style={styles.emptyContainerText}>
            Try to finish a task to be the first one!
          </Text>
        </View>
      ) : (
        <FlatList
          data={leaderboard}
          keyExtractor={item => item.userId}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainerText: {
    textAlign: 'center',
  },
  dropdown: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 8,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  dropdownText: {
    color: 'black',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
  modalItem: {
    paddingVertical: 12,
  },
  modalItemText: {
    fontSize: 16,
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
