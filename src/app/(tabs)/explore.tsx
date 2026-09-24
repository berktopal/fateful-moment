import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, ActivityIndicator } from 'react-native';
import { NavBar } from '../../components/NavBar';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { OptionCard } from '../../components/OptionCard';
import { StatusBeacon } from '../../components/StatusBeacon';
import { getIntelData, getDecisionOptions } from '../../repositories/intelRepository';
import { IntelItem, DecisionOption } from '../../types';

export default function ExploreScreen() {
  const { theme } = useTheme();
  const [activeDecisionId, setActiveDecisionId] = useState<string>('2');
  const [intelData, setIntelData] = useState<IntelItem[]>([]);
  const [options, setOptions] = useState<DecisionOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([getIntelData(), getDecisionOptions()]).then(([intel, opts]) => {
      if (mounted) {
        setIntelData(intel);
        setOptions(opts);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <NavBar title="Intel" rightIcon="refresh-cw" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator color={theme.colors.primary} size="large" style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* Tactical Decision Matrix */}
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>
                DECISION MATRIX (SELECT PROTOCOL)
              </Text>
              <StatusBeacon status="online" size={8} />
            </View>

            {options.map((option) => (
              <OptionCard
                key={option.id}
                text={option.text}
                state={activeDecisionId === option.id ? 'active' : 'default'}
                onPress={() => setActiveDecisionId(option.id)}
              />
            ))}

            <View style={{ height: theme.spacing.md }} />

            {/* Tactical Satellite Map */}
            <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>
              TERRAIN TOPOLOGY
            </Text>
            <View
              style={[
                styles.mapContainer,
                {
                  borderRadius: theme.radius.lg,
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.surface,
                },
              ]}>
              <ImageBackground
                source={{
                  uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000',
                }}
                resizeMode="cover"
                style={styles.mapImage}
                imageStyle={{ borderRadius: theme.radius.lg, opacity: 0.45 }}>
                <View style={styles.mapOverlay}>
                  <Feather name="crosshair" size={44} color={theme.colors.primary} />
                  <Text style={[styles.mapText, { color: theme.colors.primary }]}>
                    SCANNING ACTIVE SECTORS...
                  </Text>
                </View>
              </ImageBackground>
            </View>

            {/* Live Intelligence Feeds */}
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>
                LATEST INTELLIGENCE
              </Text>
              <StatusBeacon status="warning" size={8} />
            </View>

            {intelData.map((intel) => (
              <View
                key={intel.id}
                style={[
                  styles.intelCard,
                  {
                    backgroundColor: theme.colors.surface,
                    borderRadius: theme.radius.lg,
                    borderColor: theme.colors.border,
                  },
                ]}>
                <View style={styles.intelHeader}>
                  <Text style={[styles.intelTitle, { color: theme.colors.textPrimary }]}>
                    {intel.title}
                  </Text>
                  <View
                    style={[
                      styles.threatBadge,
                      intel.threat === 'High'
                        ? { backgroundColor: theme.colors.accent }
                        : intel.threat === 'Medium'
                        ? { backgroundColor: '#F59E0B' }
                        : { backgroundColor: theme.colors.primary },
                    ]}>
                    <Text style={styles.threatText}>{intel.threat}</Text>
                  </View>
                </View>
                <View style={styles.intelFooter}>
                  <Feather name="map-pin" size={13} color={theme.colors.textMuted} />
                  <Text style={[styles.intelLocation, { color: theme.colors.textMuted }]}>
                    {intel.location}
                  </Text>
                </View>
              </View>
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
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  mapContainer: {
    height: 190,
    marginBottom: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  mapImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapOverlay: {
    alignItems: 'center',
    gap: 8,
  },
  mapText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  intelCard: {
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  intelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  intelTitle: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    marginRight: 12,
  },
  threatBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
  },
  threatText: {
    color: '#020617',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  intelFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  intelLocation: {
    fontSize: 13,
  },
});
