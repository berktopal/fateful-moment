import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NavBar } from '../../components/NavBar';
import { COLORS } from '../../constants/Colors';
import { Feather } from '@expo/vector-icons';

export default function SystemScreen() {
  const modules = [
    { name: 'Mainframe Uplink', status: 'Online', icon: 'server' },
    { name: 'Firewall Protocol', status: 'Active', icon: 'shield' },
    { name: 'Communication Relay', status: 'Interrupted', icon: 'radio' },
    { name: 'Power Grid', status: 'Stable', icon: 'zap' },
  ];

  return (
    <View style={styles.container}>
      <NavBar title="System" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>MODULE DIAGNOSTICS</Text>
        
        {modules.map((mod, index) => (
          <View key={index} style={styles.moduleCard}>
            <View style={styles.iconContainer}>
              <Feather name={mod.icon as any} size={24} color={COLORS.primary} />
            </View>
            <View style={styles.moduleInfo}>
              <Text style={styles.moduleName}>{mod.name}</Text>
              <Text 
                style={[
                  styles.moduleStatus, 
                  mod.status === 'Interrupted' && { color: COLORS.accent }
                ]}
              >
                {mod.status}
              </Text>
            </View>
            <Feather 
              name={mod.status === 'Interrupted' ? 'alert-triangle' : 'check-circle'} 
              size={20} 
              color={mod.status === 'Interrupted' ? COLORS.accent : COLORS.primary} 
            />
          </View>
        ))}
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
  sectionTitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 16,
    marginTop: 8,
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 211, 243, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  moduleStatus: {
    color: COLORS.primary,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
