import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { NavBar } from '../../components/NavBar';
import { COLORS } from '../../constants/Colors';
import { Button } from '../../components/Button';
import { InteractiveSelection } from '../../components/InteractiveSelection';

export default function ExploreScreen() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <View style={styles.container}>
      <NavBar title="STYLE GUIDE" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Color Palette */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>01. COLOR PALETTE</Text>
          <View style={styles.colorRow}>
            <View style={styles.colorBlock}>
              <View style={[styles.colorBox, { backgroundColor: COLORS.primary }]} />
              <Text style={styles.colorName}>PRIMARY</Text>
              <Text style={styles.colorHex}>{COLORS.primary}</Text>
            </View>
            <View style={styles.colorBlock}>
              <View style={[styles.colorBox, { backgroundColor: COLORS.secondary }]} />
              <Text style={styles.colorName}>SECONDARY</Text>
              <Text style={styles.colorHex}>{COLORS.secondary}</Text>
            </View>
            <View style={styles.colorBlock}>
              <View style={[styles.colorBox, { backgroundColor: COLORS.accent }]} />
              <Text style={styles.colorName}>ACCENT</Text>
              <Text style={styles.colorHex}>{COLORS.accent}</Text>
            </View>
          </View>
          <View style={[styles.colorRow, { marginTop: 16 }]}>
            <View style={styles.colorBlock}>
              <View style={[styles.colorBox, { backgroundColor: COLORS.background }]} />
              <Text style={styles.colorName}>BACKGROUND</Text>
              <Text style={styles.colorHex}>{COLORS.background}</Text>
            </View>
            <View style={styles.colorBlock}>
              <View style={[styles.colorBox, { backgroundColor: COLORS.border }]} />
              <Text style={styles.colorName}>BORDER</Text>
              <Text style={styles.colorHex}>{COLORS.border}</Text>
            </View>
            <View style={styles.colorBlock}>
              <View style={[styles.colorBox, { backgroundColor: COLORS.text }]} />
              <Text style={styles.colorName}>TEXT</Text>
              <Text style={styles.colorHex}>{COLORS.text}</Text>
            </View>
          </View>
        </View>

        {/* Typography */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>02. TYPOGRAPHY</Text>
          <View style={styles.typeRow}>
            <Text style={styles.typeLabel}>DISPLAY</Text>
            <Text style={[styles.typeSample, { fontSize: 24, fontStyle: 'italic', fontWeight: '900' }]}>STRATEGIC DECISION</Text>
          </View>
          <View style={styles.typeRow}>
            <Text style={styles.typeLabel}>HEADING</Text>
            <Text style={[styles.typeSample, { fontSize: 20, fontStyle: 'italic', fontWeight: 'bold' }]}>WAR ROOM ALPHA</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>03. INTERACTIVE COMPONENTS</Text>
          <View style={styles.buttonGrid}>
            <View style={styles.buttonCol}>
              <Button title="PRIMARY ACTIVE" onPress={() => {}} />
            </View>
            <View style={styles.buttonCol}>
              <Button title="PRIMARY DISABLED" disabled onPress={() => {}} />
            </View>
          </View>
          <View style={[styles.buttonGrid, { marginTop: 12 }]}>
            <View style={styles.buttonCol}>
              <Button title="SECONDARY" variant="secondary" onPress={() => {}} />
            </View>
            <View style={styles.buttonCol}>
              <Button title="DANGER ACTION" variant="danger" onPress={() => {}} />
            </View>
          </View>
        </View>

        {/* Interactive Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>04. CARDS & SURFACES</Text>
          <InteractiveSelection 
            options={['OPTION 1 STATE', 'OPTION 2 STATE']}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
          />
        </View>

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
  section: {
    marginBottom: 40,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 24,
  },
  sectionTitle: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginBottom: 24,
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colorBlock: {
    width: '30%',
  },
  colorBox: {
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  colorName: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: 'bold',
  },
  colorHex: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  typeLabel: {
    width: 80,
    color: COLORS.textMuted,
    fontSize: 10,
  },
  typeSample: {
    color: COLORS.text,
  },
  buttonGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  buttonCol: {
    flex: 1,
  },
});
