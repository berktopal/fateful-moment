import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NavBar } from '../../components/NavBar';
import { COLORS } from '../../constants/Colors';
import { Feather } from '@expo/vector-icons';
import { SquareCard } from '../../components/SquareCard';
import { SPACING, TYPOGRAPHY } from '../../constants/Theme';
import { SYSTEM_MODULES } from '../../data/mockData';

export default function SystemScreen() {
  const cards = [
    { id: '1', title: 'Alpha Node', subtitle: '12 Scenarios', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000' },
    { id: '2', title: 'Beta Node', subtitle: '8 Scenarios', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000' },
    { id: '3', title: 'Delta Node', subtitle: '4 Scenarios', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=1000' },
    { id: '4', title: 'Omega Node', subtitle: '1 Scenario', image: 'https://images.unsplash.com/photo-1483086431886-3590a88317fe?q=80&w=1000' },
  ];

  return (
    <View style={styles.container}>
      <NavBar title="System" leftIcon="grid" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>ARCHIVES GRID</Text>
        <View style={styles.grid}>
          {cards.map((card) => (
            <View key={card.id} style={styles.gridItem}>
              <SquareCard 
                title={card.title} 
                subtitle={card.subtitle} 
                imageUrl={card.image}
              />
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { marginTop: SPACING.xl }]}>MODULE DIAGNOSTICS</Text>
        
        {SYSTEM_MODULES.map((mod) => (
          <View key={mod.id} style={styles.moduleCard}>
            <View style={styles.iconContainer}>
              <Feather name={mod.icon} size={24} color={COLORS.primary} />
            </View>
            <View style={styles.moduleInfo}>
              <Text style={styles.moduleName}>{mod.name}</Text>
              <Text 
                style={[
                  styles.moduleStatus, 
                  mod.isWarning && { color: COLORS.accent }
                ]}
              >
                {mod.status}
              </Text>
            </View>
            <Feather 
              name={mod.isWarning ? 'alert-triangle' : 'check-circle'} 
              size={20} 
              color={mod.isWarning ? COLORS.accent : COLORS.primary} 
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
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.sm, // Gap isn't fully supported in all RN versions for wrap, we use space-between + width
  },
  gridItem: {
    width: '48%', // Leaves 4% for spacing between columns
    marginBottom: SPACING.md,
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
