import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { NavBar } from '../../components/NavBar';
import { COLORS } from '../../constants/Colors';
import { Button } from '../../components/Button';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <NavBar title="Profile" />
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200' }} 
            style={styles.avatar} 
          />
        </View>
        <Text style={styles.name}>Agent 47</Text>
        <Text style={styles.rank}>Senior Field Operative</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>142</Text>
            <Text style={styles.statLabel}>Missions</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>98%</Text>
            <Text style={styles.statLabel}>Success Rate</Text>
          </View>
        </View>

        <View style={styles.actionContainer}>
          <Button title="Edit Profile" onPress={() => {}} variant="secondary" style={styles.button} />
          <Button title="Log Out" onPress={() => {}} variant="danger" style={styles.button} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: COLORS.primary,
    overflow: 'hidden',
    marginTop: 20,
    marginBottom: 16,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  name: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  rank: {
    color: COLORS.primary,
    fontSize: 16,
    marginTop: 4,
    letterSpacing: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 32,
    width: '100%',
    justifyContent: 'space-around',
    backgroundColor: COLORS.secondary,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  actionContainer: {
    width: '100%',
    marginTop: 40,
    gap: 16,
  },
  button: {
    width: '100%',
  },
});
