import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { useTheme, MONO_FONT } from '../theme';

export default function NotFoundScreen() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Icon name="shield-alert" size={48} color={theme.colors.danger} />
      <Text style={[styles.code, { color: theme.colors.primary }]}>ERROR 404 // SIGNAL LOST</Text>
      <Text style={[theme.typography.heading, { color: theme.colors.textPrimary }]}>
        This screen doesn&apos;t exist.
      </Text>
      <Button title="Return to War Room" icon="arrow-right" onPress={() => router.replace('/')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  code: {
    fontFamily: MONO_FONT,
    fontSize: 11,
    letterSpacing: 2,
  },
});
