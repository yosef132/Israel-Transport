import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const WorkScheduleScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Work Schedule</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});

export default WorkScheduleScreen;
