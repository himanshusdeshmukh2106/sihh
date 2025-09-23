import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UsersScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Users Screen</Text>
      <Text style={styles.subtext}>Users list coming soon...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  text: { fontSize: 24, fontWeight: 'bold', color: '#1e293b' },
  subtext: { fontSize: 16, color: '#64748b', marginTop: 8 },
});

export default UsersScreen;