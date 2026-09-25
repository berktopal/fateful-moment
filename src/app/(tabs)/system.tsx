import { View, Text, StyleSheet } from 'react-native';
import { NavBar } from '../../components/NavBar';
import { ScreenContainer } from '../../components/ScreenContainer';
import { SectionHeader } from '../../components/SectionHeader';
import { SquareCard } from '../../components/SquareCard';
import { StatusBeacon } from '../../components/StatusBeacon';
import { Icon } from '../../components/Icon';
import { ARCHIVE_NODES, SYSTEM_MODULES } from '../../data/mockData';
import { useTheme, MONO_FONT } from '../../theme';

export default function SystemScreen() {
  const { theme } = useTheme();

  return (
    <ScreenContainer header={<NavBar title="System" leftIcon="squiggle" rightIcon="grid" />}>
      <SectionHeader title="Archives" accessory={<StatusBeacon status="online" size={8} />} />
      <View style={styles.grid}>
        {ARCHIVE_NODES.map((node) => (
          <SquareCard
            key={node.id}
            title={node.title}
            subtitle={`${node.scenarioCount} Scenario${node.scenarioCount === 1 ? '' : 's'}`}
            image={node.image}
            style={styles.gridItem}
          />
        ))}
      </View>

      <SectionHeader
        title="Module Diagnostics"
        style={styles.spaced}
        accessory={<StatusBeacon status="warning" size={8} />}
      />
      {SYSTEM_MODULES.map((mod) => {
        const statusColor = mod.isWarning ? theme.colors.danger : theme.colors.primary;
        return (
          <View
            key={mod.id}
            accessible
            accessibilityLabel={`${mod.name}: ${mod.status}`}
            style={[
              styles.module,
              {
                backgroundColor: theme.colors.surface,
                borderColor: mod.isWarning ? theme.colors.danger : theme.colors.border,
                borderRadius: theme.radius.lg,
              },
            ]}>
            <View
              style={[
                styles.moduleIcon,
                { backgroundColor: theme.colors.primaryTint, borderRadius: theme.radius.md },
              ]}>
              <Icon name={mod.icon} size={22} color={theme.colors.primary} />
            </View>
            <View style={styles.moduleInfo}>
              <Text style={[styles.moduleName, { color: theme.colors.textPrimary }]}>{mod.name}</Text>
              <Text style={[styles.moduleStatus, { color: statusColor }]}>{mod.status}</Text>
            </View>
            <Icon name={mod.isWarning ? 'alert-triangle' : 'check-circle'} size={18} color={statusColor} />
          </View>
        );
      })}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
  },
  gridItem: {
    width: '48%',
  },
  spaced: {
    marginTop: 28,
  },
  module: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
  },
  moduleIcon: {
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
    fontFamily: MONO_FONT,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
