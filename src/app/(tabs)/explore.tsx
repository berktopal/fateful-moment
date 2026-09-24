import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground } from 'react-native';
import { NavBar } from '../../components/NavBar';
import { COLORS } from '../../constants/Colors';
import { Feather } from '@expo/vector-icons';
import { SPACING, RADIUS, TYPOGRAPHY } from '../../constants/Theme';
import { INTEL_DATA } from '../../data/mockData';
import { OptionCard } from '../../components/OptionCard';

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <NavBar title="Intel" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.sectionTitle}>DECISION MATRIX</Text>
        <OptionCard text="Hold position and observe" state="default" />
        <OptionCard text="Initiate scanning protocol" state="active" />
        <OptionCard text="Engage hostile targets" state="passive" />
        <View style={{ height: SPACING.lg }} />

        <Text style={styles.sectionTitle}>TERRAIN TOPOLOGY</Text>
        <View style={styles.mapContainer}>
          <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000' }} 
            style={styles.mapImage}
            imageStyle={{ borderRadius: 12, opacity: 0.5 }}
          >
            <View style={styles.mapOverlay}>
              <Feather name="crosshair" size={48} color={COLORS.primary} />
              <Text style={styles.mapText}>SCANNING SECTORS...</Text>
            </View>
          </ImageBackground>
        </View>

        <Text style={styles.sectionTitle}>LATEST INTELLIGENCE</Text>
        
        {INTEL_DATA.map((intel) => (
          <View key={intel.id} style={styles.intelCard}>
            <View style={styles.intelHeader}>
              <Text style={styles.intelTitle}>{intel.title}</Text>
              <View style={[
                styles.threatBadge,
                intel.threat === 'High' ? { backgroundColor: COLORS.accent } :
                intel.threat === 'Medium' ? { backgroundColor: '#F59E0B' } :
                { backgroundColor: COLORS.primary }
              ]}>
                <Text style={styles.threatText}>{intel.threat}</Text>
              </View>
            </View>
            <View style={styles.intelFooter}>
              <Feather name="map-pin" size={14} color={COLORS.textMuted} />
              <Text style={styles.intelLocation}>{intel.location}</Text>
            </View>
          </View>
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
  mapContainer: {
    height: 200,
    marginBottom: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.secondary,
  },
  mapImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapOverlay: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  mapText: {
    ...TYPOGRAPHY.caption,
  },
  sectionTitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  intelCard: {
    backgroundColor: COLORS.secondary,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  intelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  intelTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 12,
  },
  threatBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  threatText: {
    color: COLORS.background,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  intelFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  intelLocation: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
});
