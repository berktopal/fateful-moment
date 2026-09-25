import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NavBar } from '../../components/NavBar';
import { Icon } from '../../components/Icon';
import { SquareCard } from '../../components/SquareCard';
import { StatusBeacon } from '../../components/StatusBeacon';
import { useTheme } from '../../theme';
import { SYSTEM_MODULES } from '../../data/mockData';

export default function SystemScreen() {
  const { theme, isDark } = useTheme();

  const cards = [
    {
      id: '1',
      title: 'Alpha Node',
      subtitle: '12 Scenarios',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000',
    },
    {
      id: '2',
      title: 'Beta Node',
      subtitle: '8 Scenarios',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000',
    },
    {
      id: '3',
      title: 'Delta Node',
      subtitle: '4 Scenarios',
      image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=1000',
    },
    {
      id: '4',
      title: 'Omega Node',
      subtitle: '1 Scenario',
      image: 'https://images.unsplash.com/photo-1483086431886-3590a88317fe?q=80&w=1000',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <NavBar title="System" leftIcon="squiggle" rightIcon="grid" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Aspect Ratio Controlled 2-Column Grid */}
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>
            ARCHIVES GRID (1:1 RATIO)
          </Text>
          <StatusBeacon status="online" size={8} />
        </View>

        <View style={styles.grid}>
          {cards.map((card) => (
            <View key={card.id} style={styles.gridItem}>
              <SquareCard title={card.title} subtitle={card.subtitle} imageUrl={card.image} />
            </View>
          ))}
        </View>

        {/* Module Diagnostics */}
        <View style={[styles.sectionHeaderRow, { marginTop: 28 }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>
            MODULE DIAGNOSTICS
          </Text>
          <StatusBeacon status="warning" size={8} />
        </View>

        {SYSTEM_MODULES.map((mod) => (
          <View
            key={mod.id}
            style={[
              styles.moduleCard,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                borderRadius: theme.radius.lg,
              },
            ]}>
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: isDark ? 'rgba(0, 211, 243, 0.1)' : 'rgba(8, 145, 178, 0.1)',
                  borderRadius: theme.radius.sm,
                },
              ]}>
              <Icon name={mod.icon} size={22} color={theme.colors.primary} />
            </View>

            <View style={styles.moduleInfo}>
              <Text style={[styles.moduleName, { color: theme.colors.textPrimary }]}>
                {mod.name}
              </Text>
              <Text
                style={[
                  styles.moduleStatus,
                  { color: mod.isWarning ? theme.colors.accent : theme.colors.primary },
                ]}>
                {mod.status}
              </Text>
            </View>

            <Icon
              name={mod.isWarning ? 'alert-triangle' : 'check-circle'}
              size={18}
              color={mod.isWarning ? theme.colors.accent : theme.colors.primary}
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
  },
  content: {
    padding: 16,
    paddingBottom: 48,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: 14,
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
  },
  moduleStatus: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
