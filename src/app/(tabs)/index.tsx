import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { NavBar } from '../../components/NavBar';
import { ScenarioCard } from '../../components/ScenarioCard';
import { COLORS } from '../../constants/Colors';
import { SPACING } from '../../constants/Theme';
import { FEATURED_SCENARIO, SCENARIOS } from '../../data/mockData';
import { Scenario } from '../../types';

export default function HomeScreen() {
  const handleStartMission = (scenario: Scenario) => {
    Alert.alert(
      'MISSION PROTOCOL ENGAGED',
      `Deploying tactical operatives to "${scenario.title}". Estimated time to objective: ${scenario.duration}.`,
      [{ text: 'PROCEED TO OPS', style: 'default' }, { text: 'ABORT', style: 'cancel' }]
    );
  };

  return (
    <View style={styles.container}>
      <NavBar title="War Room Alpha" rightIcon="bell" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Featured Strategic Scenario */}
        <ScenarioCard
          title={FEATURED_SCENARIO.title}
          description={FEATURED_SCENARIO.description}
          imageUrl={FEATURED_SCENARIO.imageUrl}
          headerText={`CRITICAL PROTOCOL • ${FEATURED_SCENARIO.duration}`}
          iconName="activity"
          onStart={() => handleStartMission(FEATURED_SCENARIO)}
          isLarge
        />
        
        {/* Tactical Mission List */}
        {SCENARIOS.map((scenario) => (
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

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
});
