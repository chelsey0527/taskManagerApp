import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

type Props = {
  userId: string;
};

const HomeScreen: React.FC<Props> = ({userId}) => {
  const [homeData, setHomeData] = useState<any>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      // const data = await fetchUserHomeData(userId);
      const data = {};
      setHomeData(data);
    };

    fetchHomeData();
  }, [userId]);

  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Text>{homeData ? JSON.stringify(homeData) : 'Loading...'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
