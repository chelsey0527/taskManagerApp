import React from 'react';
import {View, Image, StyleSheet, Text} from 'react-native';

const CustomHeader: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/icon-header.png')}
        style={styles.icon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    backgroundColor: '#fff',
  },
  icon: {
    width: 40,
    height: 40,
  },
});

export default CustomHeader;
