import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../theme';
import { Button } from '../components/Button';
import { OptionCard } from '../components/OptionCard';
import { TimerBar } from '../components/TimerBar';
import { StatusBeacon } from '../components/StatusBeacon';
import { SquareCard } from '../components/SquareCard';
import { InteractiveSelection } from '../components/InteractiveSelection';

export default function GalleryScreen() {
  const { theme, preference, setPreference, isDark } = useTheme();
  const [selectedRadio, setSelectedRadio] = useState(1);
  const [activeOption, setActiveOption] = useState<'default' | 'active' | 'passive'>('active');

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}>
      
      {/* Theme Control */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>THEME CONTROLLER</Text>
        <Text style={[styles.label, { color: theme.colors.textMuted }]}>
          Current: {preference.toUpperCase()} ({isDark ? 'Dark Mode' : 'Light Mode'})
        </Text>
        <View style={styles.row}>
          <Button
            title="DARK"
            size="sm"
            variant={preference === 'dark' ? 'primary' : 'secondary'}
            onPress={() => setPreference('dark')}
          />
          <Button
            title="LIGHT"
            size="sm"
            variant={preference === 'light' ? 'primary' : 'secondary'}
            onPress={() => setPreference('light')}
          />
          <Button
            title="SYSTEM"
            size="sm"
            variant={preference === 'system' ? 'primary' : 'secondary'}
            onPress={() => setPreference('system')}
          />
        </View>
      </View>

      {/* Status Beacons */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>STATUS BEACONS (STYLE GUIDE)</Text>
        <View style={styles.beaconRow}>
          <View style={styles.beaconItem}>
            <StatusBeacon status="online" />
            <Text style={[styles.sublabel, { color: theme.colors.textMuted }]}>ONLINE</Text>
          </View>
          <View style={styles.beaconItem}>
            <StatusBeacon status="warning" />
            <Text style={[styles.sublabel, { color: theme.colors.textMuted }]}>WARNING</Text>
          </View>
          <View style={styles.beaconItem}>
            <StatusBeacon status="critical" />
            <Text style={[styles.sublabel, { color: theme.colors.textMuted }]}>CRITICAL</Text>
          </View>
          <View style={styles.beaconItem}>
            <StatusBeacon status="standby" />
            <Text style={[styles.sublabel, { color: theme.colors.textMuted }]}>STANDBY</Text>
          </View>
        </View>
      </View>

      {/* Timer Bar */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>TIMER BAR (CYAN → RED GRADIENT)</Text>
        <TimerBar progress={0.85} label="OBJECTIVE DEADLINE" />
        <TimerBar progress={0.35} label="SECURITY OVERRIDE" />
      </View>

      {/* Button Matrix */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>BUTTON STATE MATRIX</Text>
        <View style={styles.buttonCol}>
          <Button title="PRIMARY ACTIVE (LG)" size="lg" variant="primary" onPress={() => {}} />
          <Button title="PRIMARY DISABLED" variant="primary" disabled onPress={() => {}} />
          <Button title="SECONDARY ACTION" variant="secondary" onPress={() => {}} />
          <Button title="DANGER OVERRIDE" variant="danger" onPress={() => {}} />
          <Button title="DARK HUD VARIANT" variant="dark" onPress={() => {}} />
          <Button title="LOADING STATE" loading onPress={() => {}} />
        </View>
      </View>

      {/* Option Cards */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>OPTION CARDS (IS_SELECTED STATES)</Text>
        <OptionCard
          text="State: Active / Selected (Tap to toggle)"
          state={activeOption}
          onPress={() => setActiveOption((prev) => (prev === 'active' ? 'default' : 'active'))}
        />
        <OptionCard text="State: Default (Tap to activate)" state="default" onPress={() => {}} />
        <OptionCard text="State: Passive / Disabled" state="passive" onPress={() => {}} />
      </View>

      {/* Interactive Selection */}
      <InteractiveSelection
        options={['Autonomous Defense Grid', 'Orbital Relays', 'Deep Cyber Defense']}
        selectedIndex={selectedRadio}
        onSelect={setSelectedRadio}
      />

      {/* Square Card */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>1:1 SQUARE CARD (ASPECT RATIO FIX)</Text>
        <View style={styles.cardPreview}>
          <SquareCard title="Echo Protocol" subtitle="12 SCENARIOS" />
        </View>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 60,
    gap: 16,
  },
  section: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  beaconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  beaconItem: {
    alignItems: 'center',
    gap: 6,
  },
  sublabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  buttonCol: {
    gap: 10,
  },
  cardPreview: {
    width: 170,
  },
});
