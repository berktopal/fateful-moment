import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/Colors';
import { View, StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.iconContainer}>
              <Feather name="activity" size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.iconContainer}>
              <Feather name="compass" size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="vitals"
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.iconContainer}>
              <Feather name="heart" size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.iconContainer}>
              <Feather name="user" size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="system"
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.iconContainer}>
              <Feather name="cpu" size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.iconContainer}>
              <Feather name="settings" size={24} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.background,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    height: 70,
    paddingBottom: 10,
    paddingTop: 10,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
