import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { NavBar } from '../../components/NavBar';
import { Button } from '../../components/Button';
import { StatusBeacon } from '../../components/StatusBeacon';
import { useTheme } from '../../theme';

export default function ProfileScreen() {
  const { theme } = useTheme();

  const handleEditProfile = () => {
    Alert.alert('OPERATIVE PROFILE', 'Editing clearance credentials is restricted in trial mode.');
  };

  const handleLogout = () => {
    Alert.alert('TERMINATE SESSION', 'Disconnecting operative link from command mainframe.', [
      { text: 'ABORT', style: 'cancel' },
      { text: 'DISCONNECT', style: 'destructive' },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <NavBar title="Profile" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Operative Avatar */}
        <View style={styles.avatarWrapper}>
          <View
            style={[
              styles.avatarContainer,
              {
                borderColor: theme.colors.primary,
                backgroundColor: theme.colors.surface,
              },
            ]}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300',
              }}
              resizeMode="cover"
              style={styles.avatar}
            />
          </View>
          <View style={styles.beaconPosition}>
            <StatusBeacon status="online" size={12} />
          </View>
        </View>

        <Text style={[styles.name, { color: theme.colors.textPrimary }]}>Agent 47</Text>
        <Text style={[styles.rank, { color: theme.colors.primary }]}>
          SENIOR FIELD OPERATIVE
        </Text>

        {/* Tactical Performance Metrics */}
        <View
          style={[
            styles.statsContainer,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.lg,
            },
          ]}>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: theme.colors.textPrimary }]}>142</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>MISSIONS</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: theme.colors.primary }]}>98%</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>
              SUCCESS RATE
            </Text>
          </View>
        </View>

        {/* Action Controls */}
        <View style={styles.actionContainer}>
          <Button
            title="EDIT OPERATIVE PROFILE"
            onPress={handleEditProfile}
            variant="secondary"
            size="md"
          />
          <Button
            title="TERMINATE SESSION"
            onPress={handleLogout}
            variant="danger"
            size="md"
          />
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    padding: 24,
    paddingBottom: 48,
  },
  avatarWrapper: {
    position: 'relative',
    marginTop: 10,
    marginBottom: 16,
  },
  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  beaconPosition: {
    position: 'absolute',
    bottom: 2,
    right: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: '900',
    fontStyle: 'italic',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rank: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: 1.5,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 28,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderWidth: 1,
  },
  statDivider: {
    width: 1,
    height: 36,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 26,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: 1.2,
  },
  actionContainer: {
    width: '100%',
    marginTop: 34,
    gap: 14,
  },
});
