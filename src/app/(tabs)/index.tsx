import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { NavBar } from '../../components/NavBar';
import { ScenarioCard } from '../../components/ScenarioCard';
import { COLORS } from '../../constants/Colors';

const DUMMY_SCENARIOS = [
  {
    id: '1',
    title: 'Operation Midnight',
    description: 'Infiltrate the secure compound and extract the VIP before dawn. Stealth is critical, every choice matters.',
    imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Cyber Heist',
    description: 'Breach the mainframe of a mega-corporation. Hack the firewalls, avoid detection, and secure the data.',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Fallout Rescue',
    description: 'Navigate through a post-apocalyptic wasteland to rescue survivors trapped in a collapsed bunker.',
    imageUrl: 'https://images.unsplash.com/photo-1483086431886-3590a88317fe?q=80&w=2000&auto=format&fit=crop',
  }
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <NavBar title="War Room Alpha" rightIcon="bell" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ScenarioCard
          title="Global Crisis"
          description="A worldwide alert has been triggered. Assemble your team, analyze the threat, and make the strategic decisions that will define the fate of millions."
          imageUrl="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop"
          onStart={() => {}}
          isLarge
        />
        
        {DUMMY_SCENARIOS.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            title={scenario.title}
            description={scenario.description}
            imageUrl={scenario.imageUrl}
            onStart={() => {}}
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
    padding: 16,
    paddingBottom: 40,
  },
});
