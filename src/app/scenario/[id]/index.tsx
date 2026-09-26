import { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../../components/Text';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { NavBar } from '../../../components/NavBar';
import { ScreenContainer } from '../../../components/ScreenContainer';
import { ScreenFooter } from '../../../components/ScreenFooter';
import { HudCard } from '../../../components/HudCard';
import { Button } from '../../../components/Button';
import { Icon, IconName } from '../../../components/Icon';
import { findScenario } from '../../../repositories/scenarioRepository';
import { threatColor } from '../../../features/simulation/presentation';
import { useAppStore } from '../../../store/AppStore';
import { useTheme, MEDIA_COLORS, MONO_FONT } from '../../../theme';
import { useI18n } from '../../../i18n';

export default function ScenarioBriefingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, language, upper } = useI18n();
  const scenario = findScenario(id, language);
  const { theme } = useTheme();
  const { history } = useAppStore();

  const bestScore = useMemo(() => {
    const runs = history.filter((r) => r.scenarioId === id);
    return runs.length ? Math.max(...runs.map((r) => r.score)) : null;
  }, [history, id]);

  const header = (
    <NavBar
      title={t.briefing.title}
      left={{ icon: 'arrow-left', onPress: () => router.back(), accessibilityLabel: t.common.back }}
    />
  );

  if (!scenario) {
    return (
      <ScreenContainer
        header={header}
        error={t.briefing.notFound}
        onRetry={() => router.back()}
        retryLabel={t.common.goBack}
      />
    );
  }

  const playable = scenario.isActive && scenario.steps.length > 0;
  const facts: { icon: IconName; label: string; color?: string }[] = [
    {
      icon: 'shield-alert',
      label: t.scenario.threat[scenario.threatLevel],
      color: threatColor(theme, scenario.threatLevel),
    },
    { icon: 'alarm-clock', label: scenario.duration },
    { icon: 'squiggle', label: t.briefing.decisions(scenario.steps.length) },
  ];

  return (
    <ScreenContainer
      header={header}
      footer={
        <ScreenFooter>
          <Button
            title={playable ? t.scenario.startSimulation : t.scenario.locked}
            icon={playable ? 'play' : 'lock'}
            size="lg"
            disabled={!playable}
            onPress={() => router.push(`/scenario/${scenario.id}/play`)}
          />
        </ScreenFooter>
      }>
      <View style={[styles.hero, { borderRadius: theme.radius.hero, borderColor: MEDIA_COLORS.border }]}>
        <Image source={scenario.image} contentFit="cover" transition={250} style={StyleSheet.absoluteFill} />
        <LinearGradient colors={MEDIA_COLORS.scrimHero} style={styles.heroContent}>
          <Text style={[styles.hud, { color: MEDIA_COLORS.accent }]}>{t.briefing.hud}</Text>
          <Text style={[theme.typography.displayLarge, styles.heroTitle]} accessibilityRole="header">
            {upper(scenario.title)}
          </Text>
        </LinearGradient>
      </View>

      <View style={styles.facts}>
        {facts.map((fact) => (
          <View
            key={fact.label}
            style={[styles.fact, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
            <Icon name={fact.icon} size={14} color={fact.color ?? theme.colors.primary} />
            <Text style={[styles.factText, { color: fact.color ?? theme.colors.textPrimary }]}>
              {fact.label}
            </Text>
          </View>
        ))}
      </View>

      <Text style={[theme.typography.body, styles.description, { color: theme.colors.textMuted }]}>
        {scenario.description}
      </Text>

      <HudCard
        tag={t.briefing.rulesTag}
        title={t.briefing.rulesTitle}
        description={t.briefing.rulesBody}
        chips={bestScore !== null ? [t.briefing.bestScore(bestScore)] : [t.briefing.firstDeployment]}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    aspectRatio: 16 / 10,
    overflow: 'hidden',
    borderWidth: 1,
    backgroundColor: MEDIA_COLORS.base,
    marginBottom: 16,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
  hud: {
    fontFamily: MONO_FONT,
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 6,
  },
  heroTitle: {
    color: MEDIA_COLORS.textPrimary,
    fontSize: 28,
  },
  facts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  fact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  factText: {
    fontFamily: MONO_FONT,
    fontSize: 11,
    fontWeight: '700',
  },
  description: {
    marginBottom: 20,
  },
});
