import React from 'react';
import {View, Image, StyleSheet, Text} from 'react-native';

interface CustomHeaderProps {
  routeName: string;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({routeName}) => {
  return (
    <View style={styles.container}>
      {routeName === 'SignIn' || routeName === 'SignUp' ? (
        <Image
          source={require('../assets/icon-header.png')}
          style={styles.icon}
        />
      ) : (
        <Text style={styles.title}>{routeName}</Text>
      )}
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CustomHeader;
