import { useMemo } from 'react';
import { router } from 'expo-router';
import { NavBar } from '../../components/NavBar';
import { ScenarioCard } from '../../components/ScenarioCard';
import { TimerBar } from '../../components/TimerBar';
import { SectionHeader } from '../../components/SectionHeader';
import { ScreenContainer } from '../../components/ScreenContainer';
import { StatusBeacon } from '../../components/StatusBeacon';
import { useAsyncData } from '../../hooks/useAsyncData';
import { useAppStore } from '../../store/AppStore';
import { getFeaturedScenario, getScenarios } from '../../repositories/scenarioRepository';
import type { Scenario } from '../../types';

const loadHome = () => Promise.all([getFeaturedScenario(), getScenarios()]);

const openBriefing = (scenario: Scenario) => router.push(`/scenario/${scenario.id}`);

export default function HomeScreen() {
  const { data, loading, error, reload } = useAsyncData(loadHome);
  const { history } = useAppStore();
  const [featured, scenarios] = data ?? [null, []];

  // Campaign progress: distinct playable scenarios completed at least once.
  const progress = useMemo(() => {
    const playable = [featured, ...scenarios].filter(
      (s): s is Scenario => !!s && s.isActive && s.steps.length > 0
    );
    const done = new Set(history.map((r) => r.scenarioId));
    const completed = playable.filter((s) => done.has(s.id)).length;
    return { completed, total: playable.length };
  }, [featured, scenarios, history]);

  return (
    <ScreenContainer
      header={
        <NavBar
          title="War Room Alpha"
          leftIcon="squiggle"
          rightIcon="bell-dot"
          onRightPress={() => router.push('/explore')}
        />
      }
      loading={loading}
      error={error}
      onRetry={reload}>
      {featured && (
        <ScenarioCard
          title={featured.title}
          description={featured.description}
          image={featured.image}
          headerText="Scenario Briefing"
          onStart={() => openBriefing(featured)}
          isLarge
        />
      )}

      <TimerBar
        progress={progress.total ? progress.completed / progress.total : 0}
        label="CAMPAIGN PROGRESS"
        trailingLabel={`${progress.completed}/${progress.total}`}
        style={{ marginBottom: 24 }}
      />

      <SectionHeader title="Scenarios" accessory={<StatusBeacon status="online" size={8} />} />
      {scenarios.map((scenario) => (
        <ScenarioCard
          key={scenario.id}
          title={scenario.title}
          description={scenario.description}
          image={scenario.image}
          onStart={() => openBriefing(scenario)}
          isActive={scenario.isActive}
          headerText={scenario.isActive ? scenario.duration : `Locked · ${scenario.duration}`}
        />
      ))}
    </ScreenContainer>
  );
}
