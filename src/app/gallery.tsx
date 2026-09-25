import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../theme';
import { Button } from '../components/Button';
import { OptionCard } from '../components/OptionCard';
import { TimerBar } from '../components/TimerBar';
import { StatusBeacon } from '../components/StatusBeacon';
import { SquareCard } from '../components/SquareCard';
import { InteractiveSelection } from '../components/InteractiveSelection';
import { IconButton } from '../components/IconButton';
import { HudCard } from '../components/HudCard';
import { ScanlineOverlay } from '../components/ScanlineOverlay';
import { ScenarioCard } from '../components/ScenarioCard';
import type { ButtonAppearance, ButtonVariant } from '../components/Button';
import { SCENARIOS } from '../data/mockData';

const BUTTON_VARIANTS: ButtonVariant[] = ['primary', 'secondary', 'neutral', 'soft', 'danger'];
const BUTTON_APPEARANCES: ButtonAppearance[] = ['solid', 'outline', 'link'];

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

      {/* Button Matrix (Figma "Buttons" board) */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>BUTTON MATRIX</Text>
        {BUTTON_VARIANTS.map((variant) => (
          <View key={variant} style={styles.buttonRow}>
            {BUTTON_APPEARANCES.map((appearance) => (
              <Button
                key={appearance}
                title="Button"
                icon="arrow-right"
                size="sm"
                variant={variant}
                appearance={appearance}
                onPress={() => {}}
              />
            ))}
          </View>
        ))}
        <View style={styles.buttonCol}>
          <Button title="PRIMARY ACTIVE" size="lg" onPress={() => {}} />
          <Button title="PRIMARY DISABLED" disabled onPress={() => {}} />
          <Button title="SECONDARY" variant="secondary" onPress={() => {}} />
          <Button title="DANGER ACTION" variant="danger" onPress={() => {}} />
          <Button title="Loading" loading onPress={() => {}} />
        </View>
      </View>

      {/* Icon Buttons */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>ICON BUTTONS</Text>
        <View style={styles.row}>
          <IconButton icon="squiggle" isActive />
          <IconButton icon="squiggle" />
          <IconButton icon="compass" bordered />
          <IconButton icon="history" bordered />
          <IconButton icon="shield-alert" bordered />
        </View>
      </View>

      {/* HUD Surfaces */}
      <HudCard
        tag="SURFACE_A // ENCRYPTED"
        title="Standard Card Layout"
        description="Example of a cinematic container with HUD accents and specific typography alignment."
        chips={['STATUS: GREEN', 'LOAD: STABLE']}
        alert
      />
      <View style={[styles.scanlineDemo, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        <ScanlineOverlay />
      </View>

      {/* Scenario Cards */}
      <ScenarioCard
        title="Title"
        description="Default Scenario Text Is Here. Default Scenario Text Is Here."
        image={SCENARIOS[0].image}
        headerText="0:00 min"
        onStart={() => {}}
      />
      <ScenarioCard
        title="Title"
        description="Default Scenario Text Is Here. Default Scenario Text Is Here."
        image={SCENARIOS[0].image}
        headerText="0:00 min"
        isActive={false}
        onStart={() => {}}
      />

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
          <SquareCard title="Description" subtitle="12 Scenarios" />
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
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  scanlineDemo: {
    height: 80,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardPreview: {
    width: 170,
  },
});

