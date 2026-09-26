import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, IconName } from '../../components/Icon';
import { useTheme } from '../../theme';
import { useI18n } from '../../i18n';

// Order and glyphs follow the Figma "Menu - Tabbar" board.
const TABS = [
  { name: 'index', icon: 'squiggle' },
  { name: 'explore', icon: 'compass' },
  { name: 'vitals', icon: 'activity' },
  { name: 'profile', icon: 'user' },
  { name: 'system', icon: 'cpu' },
  { name: 'settings', icon: 'settings' },
] as const satisfies readonly { name: string; icon: IconName }[];

const BAR_HEIGHT = 60;

export default function TabLayout() {
  const { theme } = useTheme();
  const { t } = useI18n();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.iconMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          // An explicit height replaces React Navigation's own inset handling, so add it back.
          height: BAR_HEIGHT + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom + 8,
        },
      }}>
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: t.tabs[tab.name],
            tabBarAccessibilityLabel: t.tabs[tab.name],
            tabBarIcon: ({ color, focused }) => (
              <View
                style={[
                  styles.iconContainer,
                  { borderRadius: theme.radius.lg },
                  focused && { backgroundColor: theme.colors.primaryTint },
                ]}>
                <Icon name={tab.icon} size={24} color={color as string} />
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
