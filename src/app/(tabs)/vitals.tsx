import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NavBar } from '../../components/NavBar';
import { COLORS } from '../../constants/Colors';
import { Feather } from '@expo/vector-icons';

export default function VitalsScreen() {
  const stats = [
    { label: 'Core Temperature', value: '42°C', status: 'normal' },
    { label: 'Heart Rate', value: '84 BPM', status: 'normal' },
    { label: 'Radiation Level', value: '0.02 Sv', status: 'warning' },
    { label: 'System Integrity', value: '98.4%', status: 'good' },
  ];

  return (
    <View style={styles.container}>
      <NavBar title="Vitals" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Feather name="heart" size={48} color={COLORS.primary} />
          <Text style={styles.mainTitle}>Commander Health</Text>
        </View>

        <View style={styles.card}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statRow}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={[styles.statValue, stat.status === 'warning' && { color: COLORS.accent }]}>
                {stat.value}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  mainTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  card: {
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 16,
  },
  statValue: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
