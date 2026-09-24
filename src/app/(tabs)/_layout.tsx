import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

export default function TabLayout() {
  const { theme, isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: theme.colors.background,
            borderTopColor: theme.colors.border,
          },
        ],
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && {
                  backgroundColor: isDark
                    ? 'rgba(0, 211, 243, 0.12)'
                    : 'rgba(8, 145, 178, 0.12)',
                  borderRadius: 8,
                },
              ]}>
              <Feather name="activity" size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && {
                  backgroundColor: isDark
                    ? 'rgba(0, 211, 243, 0.12)'
                    : 'rgba(8, 145, 178, 0.12)',
                  borderRadius: 8,
                },
              ]}>
              <Feather name="compass" size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="vitals"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && {
                  backgroundColor: isDark
                    ? 'rgba(0, 211, 243, 0.12)'
                    : 'rgba(8, 145, 178, 0.12)',
                  borderRadius: 8,
                },
              ]}>
              <Feather name="heart" size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && {
                  backgroundColor: isDark
                    ? 'rgba(0, 211, 243, 0.12)'
                    : 'rgba(8, 145, 178, 0.12)',
                  borderRadius: 8,
                },
              ]}>
              <Feather name="user" size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="system"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && {
                  backgroundColor: isDark
                    ? 'rgba(0, 211, 243, 0.12)'
                    : 'rgba(8, 145, 178, 0.12)',
                  borderRadius: 8,
                },
              ]}>
              <Feather name="cpu" size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && {
                  backgroundColor: isDark
                    ? 'rgba(0, 211, 243, 0.12)'
                    : 'rgba(8, 145, 178, 0.12)',
                  borderRadius: 8,
                },
              ]}>
              <Feather name="settings" size={22} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    height: 68,
    paddingBottom: 8,
    paddingTop: 8,
  },
  iconContainer: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
