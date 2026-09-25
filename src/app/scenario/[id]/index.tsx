import { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../../../components/Text';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavBar } from '../../../components/NavBar';
import { ScreenContainer } from '../../../components/ScreenContainer';
import { HudCard } from '../../../components/HudCard';
import { Button } from '../../../components/Button';
import { Icon, IconName } from '../../../components/Icon';
import { findScenario } from '../../../repositories/scenarioRepository';
import { threatColor } from '../../../features/simulation/presentation';
import { useAppStore } from '../../../store/AppStore';
import { useTheme, MEDIA_COLORS, MONO_FONT } from '../../../theme';

export default function ScenarioBriefingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scenario = findScenario(id);
  const { theme } = useTheme();
  const { history } = useAppStore();
  const insets = useSafeAreaInsets();

  const bestScore = useMemo(() => {
    const runs = history.filter((r) => r.scenarioId === id);
    return runs.length ? Math.max(...runs.map((r) => r.score)) : null;
  }, [history, id]);

  const header = <NavBar title="Briefing" leftIcon="arrow-left" onLeftPress={() => router.back()} />;

  if (!scenario) {
    return (
      <ScreenContainer
        header={header}
        error="This scenario could not be found."
        onRetry={() => router.back()}
        retryLabel="Go Back"
      />
    );
  }

  const playable = scenario.isActive && scenario.steps.length > 0;
  const facts: { icon: IconName; label: string; color?: string }[] = [
    { icon: 'shield-alert', label: scenario.threatLevel, color: threatColor(theme, scenario.threatLevel) },
    { icon: 'alarm-clock', label: scenario.duration },
    { icon: 'squiggle', label: `${scenario.steps.length} decisions` },
  ];

  return (
    <ScreenContainer
      header={header}
      footer={
        <View
          style={[
            styles.footer,
            {
              paddingBottom: insets.bottom + 12,
              backgroundColor: theme.colors.background,
              borderTopColor: theme.colors.border,
            },
          ]}>
          <Button
            title={playable ? 'Start Simulation' : 'Locked'}
            icon={playable ? 'play' : 'lock'}
            size="lg"
            disabled={!playable}
            onPress={() => router.push(`/scenario/${scenario.id}/play`)}
          />
        </View>
      }>
      <View style={[styles.hero, { borderRadius: theme.radius.xxl, borderColor: theme.colors.border }]}>
        <Image source={scenario.image} contentFit="cover" transition={250} style={StyleSheet.absoluteFill} />
        <LinearGradient colors={MEDIA_COLORS.scrim} style={styles.heroContent}>
          <Text style={[styles.hud, { color: MEDIA_COLORS.accent }]}>SCENARIO BRIEFING</Text>
          <Text style={[theme.typography.displayLarge, styles.heroTitle]} accessibilityRole="header">
            {scenario.title.toUpperCase()}
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
        tag="PROTOCOL // RULES OF ENGAGEMENT"
        title="How it works"
        description="Each decision runs on a timer. Lock in an order before it expires — if time runs out, the highlighted option is committed, or none at all. Every choice shifts national stability and public trust."
        chips={bestScore !== null ? [`BEST SCORE: ${bestScore}`] : ['FIRST DEPLOYMENT']}
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
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
