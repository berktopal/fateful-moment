import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavBar } from '../../components/NavBar';
import { COLORS } from '../../constants/Colors';

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <NavBar title="Explore" />
      <View style={styles.content}>
        <Text style={styles.text}>Explore scenarios coming soon...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: COLORS.textMuted,
    fontSize: 16,
  },
});
