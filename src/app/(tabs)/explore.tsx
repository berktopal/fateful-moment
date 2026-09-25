import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { NavBar } from '../../components/NavBar';
import { ScreenContainer } from '../../components/ScreenContainer';
import { SectionHeader } from '../../components/SectionHeader';
import { OptionCard } from '../../components/OptionCard';
import { StatusBeacon } from '../../components/StatusBeacon';
import { HudCard } from '../../components/HudCard';
import { Icon } from '../../components/Icon';
import { ScanlineOverlay } from '../../components/ScanlineOverlay';
import { useAsyncData } from '../../hooks/useAsyncData';
import { useHaptics } from '../../hooks/useHaptics';
import { getIntelData, getProtocolOptions } from '../../repositories/intelRepository';
import { TERRAIN_MAP_IMAGE } from '../../data/mockData';
import { useTheme, MONO_FONT, MEDIA_COLORS } from '../../theme';

const loadIntel = () => Promise.all([getIntelData(), getProtocolOptions()]);

export default function ExploreScreen() {
  const { theme } = useTheme();
  const haptics = useHaptics();
  const { data, loading, error, reload } = useAsyncData(loadIntel);
  const [activeProtocolId, setActiveProtocolId] = useState('2');
  const [intel, protocols] = data ?? [[], []];

  return (
    <ScreenContainer
      header={<NavBar title="Intel" leftIcon="squiggle" rightIcon="refresh-cw" onRightPress={reload} />}
      loading={loading}
      error={error}
      onRetry={reload}>
      <SectionHeader
        title="Standing Protocol"
        accessory={<StatusBeacon status="online" size={8} />}
      />
      <View accessibilityRole="radiogroup">
        {protocols.map((option) => (
          <OptionCard
            key={option.id}
            text={option.text}
            state={activeProtocolId === option.id ? 'active' : 'default'}
            onPress={() => {
              haptics.selection();
              setActiveProtocolId(option.id);
            }}
          />
        ))}
      </View>

      <SectionHeader title="Terrain Topology" style={styles.spaced} />
      <View
        style={[
          styles.map,
          { borderRadius: theme.radius.xl, borderColor: theme.colors.border, backgroundColor: theme.colors.surface },
        ]}>
        <Image source={TERRAIN_MAP_IMAGE} contentFit="cover" style={[StyleSheet.absoluteFill, styles.mapImage]} />
        <ScanlineOverlay opacity={0.12} />
        <View style={[styles.mapOverlay, { backgroundColor: MEDIA_COLORS.glass }]}>
          <Icon name="crosshair" size={44} color={theme.colors.primary} />
          <Text style={[styles.mapText, { color: theme.colors.primary }]}>SCANNING ACTIVE SECTORS…</Text>
        </View>
      </View>

      <SectionHeader
        title="Latest Intelligence"
        style={styles.spaced}
        accessory={<StatusBeacon status="warning" size={8} />}
      />
      {intel.map((item) => (
        <HudCard
          key={item.id}
          tag={`INTEL_${item.id.padStart(2, '0')} // ${item.location}`}
          title={item.title}
          chips={[`THREAT: ${item.threat}`]}
          alert={item.threat === 'High'}
        />
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  spaced: {
    marginTop: 16,
  },
  map: {
    height: 190,
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  mapImage: {
    opacity: 0.45,
  },
  mapOverlay: {
    alignItems: 'center',
    gap: 8,
    zIndex: 2,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
  },
  mapText: {
    fontFamily: MONO_FONT,
    fontSize: 11,
    letterSpacing: 1.5,
  },
});
