import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { NavBar } from '../../components/NavBar';
import { COLORS } from '../../constants/Colors';
import { Feather } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [haptic, setHaptic] = React.useState(true);
  const [notifications, setNotifications] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(true);

  return (
    <View style={styles.container}>
      <NavBar title="Settings" />
      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREFERENCES</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Feather name="moon" size={20} color={COLORS.primary} />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch 
              value={darkMode} 
              onValueChange={setDarkMode} 
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Feather name="bell" size={20} color={COLORS.primary} />
              <Text style={styles.settingText}>Push Notifications</Text>
            </View>
            <Switch 
              value={notifications} 
              onValueChange={setNotifications} 
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Feather name="smartphone" size={20} color={COLORS.primary} />
              <Text style={styles.settingText}>Haptic Feedback</Text>
            </View>
            <Switch 
              value={haptic} 
              onValueChange={setHaptic} 
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Feather name="shield" size={20} color={COLORS.primary} />
              <Text style={styles.settingText}>Security & Privacy</Text>
            </View>
            <Feather name="chevron-right" size={20} color={COLORS.textMuted} />
          </View>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.secondary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    color: COLORS.text,
    fontSize: 16,
  },
});
