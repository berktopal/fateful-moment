import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { NavBar } from '../../components/NavBar';
import { ScenarioCard } from '../../components/ScenarioCard';
import { TimerBar } from '../../components/TimerBar';
import { useTheme } from '../../theme';
import { getFeaturedScenario, getScenarios } from '../../repositories/scenarioRepository';
import { Scenario } from '../../types';

export default function HomeScreen() {
  const { theme } = useTheme();
  const [featured, setFeatured] = useState<Scenario | null>(null);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([getFeaturedScenario(), getScenarios()]).then(([feat, list]) => {
      if (mounted) {
        setFeatured(feat);
        setScenarios(list);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleStartMission = (scenario: Scenario) => {
    Alert.alert(
      'TACTICAL PROTOCOL ENGAGED',
      `Deploying tactical operatives to "${scenario.title}". Estimated time to objective: ${scenario.duration}.`,
      [{ text: 'PROCEED TO OPS', style: 'default' }, { text: 'ABORT', style: 'cancel' }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <NavBar title="War Room Alpha" rightIcon="bell" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator color={theme.colors.primary} size="large" style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* Critical Scenario Briefing */}
            {featured && (
              <ScenarioCard
                title={featured.title}
                description={featured.description}
                imageUrl={featured.imageUrl}
                headerText={`CRITICAL PROTOCOL • ${featured.duration}`}
                iconName="activity"
                onStart={() => handleStartMission(featured)}
                isLarge
              />
            )}

            {/* Tactical Mission Timer Bar (Figma Style Guide) */}
            <TimerBar progress={0.68} label="ACTIVE OPERATION WINDOW" />

            <View style={{ height: theme.spacing.md }} />

            {/* Tactical Mission List */}
            {scenarios.map((scenario) => (
              <ScenarioCard
                key={scenario.id}
                title={scenario.title}
                description={scenario.description}
                imageUrl={scenario.imageUrl}
                onStart={() => handleStartMission(scenario)}
                isActive={scenario.isActive}
                iconName="clock"
                headerText={scenario.isActive ? scenario.duration : `LOCKED • ${scenario.duration}`}
              />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 48,
  },
});
