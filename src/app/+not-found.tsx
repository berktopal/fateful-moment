import { View, StyleSheet } from 'react-native';
import { Text } from '../components/Text';
import { router } from 'expo-router';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { useTheme, MONO_FONT } from '../theme';
import { useI18n } from '../i18n';

export default function NotFoundScreen() {
  const { theme } = useTheme();
  const { t } = useI18n();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Icon name="shield-alert" size={48} color={theme.colors.danger} />
      <Text style={[styles.code, { color: theme.colors.primary }]}>{t.notFound.code}</Text>
      <Text style={[theme.typography.heading, { color: theme.colors.textPrimary }]}>
        {t.notFound.message}
      </Text>
      <Button title={t.notFound.back} icon="arrow-right" onPress={() => router.replace('/')} />
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
