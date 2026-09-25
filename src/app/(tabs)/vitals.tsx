import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NavBar } from '../../components/NavBar';
import { Icon } from '../../components/Icon';
import { StatusBeacon } from '../../components/StatusBeacon';
import { useTheme } from '../../theme';
import { COMMANDER_VITALS } from '../../data/mockData';

export default function VitalsScreen() {
  const { theme } = useTheme();
  const [pulse, setPulse] = useState(84);

  const handleRefreshTelemetry = () => {
    const jitter = Math.floor(Math.random() * 5) - 2;
    setPulse((prev) => Math.max(78, Math.min(96, prev + jitter)));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <NavBar title="Vitals" rightIcon="activity" onRightPress={handleRefreshTelemetry} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Heart Telemetry Header */}
        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <Icon name="heart" size={46} color={theme.colors.primary} />
            <View style={styles.beaconOffset}>
              <StatusBeacon status="online" size={10} />
            </View>
          </View>
          <Text style={[styles.mainTitle, { color: theme.colors.textPrimary }]}>
            Commander Health
          </Text>
          <Text style={[styles.subTitle, { color: theme.colors.textMuted }]}>
            BIOMETRIC TELEMETRY FEED
          </Text>
        </View>

        {/* Telemetry Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.lg,
            },
          ]}>
          {COMMANDER_VITALS.map((vital, index) => (
            <View
              key={index}
              style={[
                styles.statRow,
                { borderBottomColor: theme.colors.border },
                index === COMMANDER_VITALS.length - 1 && { borderBottomWidth: 0 },
              ]}>
              <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>
                {vital.label}
              </Text>
              <Text
                style={[
                  styles.statValue,
                  { color: theme.colors.primary },
                  vital.danger && { color: theme.colors.accent },
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
  },
  content: {
    padding: 16,
    paddingBottom: 48,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
    marginTop: 16,
  },
  iconWrapper: {
    position: 'relative',
  },
  beaconOffset: {
    position: 'absolute',
    top: -2,
    right: -6,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '900',
    fontStyle: 'italic',
    textTransform: 'uppercase',
    marginTop: 14,
    letterSpacing: 0.5,
  },
  subTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 4,
  },
  card: {
    padding: 20,
    borderWidth: 1,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  statLabel: {
    fontSize: 15,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
