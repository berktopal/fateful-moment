import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NavBar } from '../../components/NavBar';
import { COLORS } from '../../constants/Colors';
import { Feather } from '@expo/vector-icons';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/Theme';
import { COMMANDER_VITALS } from '../../data/mockData';

export default function VitalsScreen() {
  const [pulse, setPulse] = useState(84);

  const handleRefreshTelemetry = () => {
    // Simulate real-time biometric jitter
    const randomJitter = Math.floor(Math.random() * 5) - 2;
    setPulse((prev) => Math.max(78, Math.min(96, prev + randomJitter)));
  };

  return (
    <View style={styles.container}>
      <NavBar title="Vitals" rightIcon="activity" onRightPress={handleRefreshTelemetry} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Feather name="heart" size={48} color={COLORS.primary} />
          <Text style={styles.mainTitle}>Commander Health</Text>
        </View>

        <View style={styles.card}>
          {COMMANDER_VITALS.map((vital, index) => (
            <View key={index} style={styles.statRow}>
              <Text style={styles.statLabel}>{vital.label}</Text>
              <Text style={[
                styles.statValue, 
                vital.danger && { color: COLORS.accent },
                vital.label === 'Heart Rate' && { color: COLORS.primary }
              ]}>
                {vital.label === 'Heart Rate' ? `${pulse} BPM` : vital.value}
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
    padding: SPACING.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    marginTop: SPACING.lg,
  },
  mainTitle: {
    ...TYPOGRAPHY.title,
    fontSize: 24,
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
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
