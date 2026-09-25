import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, IconName } from '../../components/Icon';
import { useTheme } from '../../theme';

// Order and glyphs follow the Figma "Menu - Tabbar" board.
const TABS: { name: string; icon: IconName; title: string }[] = [
  { name: 'index', icon: 'squiggle', title: 'Home' },
  { name: 'explore', icon: 'compass', title: 'Explore' },
  { name: 'vitals', icon: 'activity', title: 'Vitals' },
  { name: 'profile', icon: 'user', title: 'Profile' },
  { name: 'system', icon: 'cpu', title: 'System' },
  { name: 'settings', icon: 'settings', title: 'Settings' },
];

const BAR_HEIGHT = 60;

export default function TabLayout() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const activeBg = isDark ? 'rgba(0, 211, 243, 0.12)' : 'rgba(8, 145, 178, 0.12)';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
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
            title: tab.title,
            tabBarAccessibilityLabel: tab.title,
            tabBarIcon: ({ color, focused }) => (
              <View
                style={[
                  styles.iconContainer,
                  { borderRadius: theme.radius.lg },
                  focused && { backgroundColor: activeBg },
                ]}>
                <Icon name={tab.icon} size={22} color={color as string} />
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
