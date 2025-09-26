/**
 * UserProfileCard Component
 * Displays user profile information in a clean card format
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { UserProfile, UserProfileService } from '../services/UserProfileService';
import { Card } from './ui/Card';

interface UserProfileCardProps {
  profile: UserProfile;
  onPress?: () => void;
  style?: ViewStyle;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  profile,
  onPress,
  style,
}) => {
  const displayName = UserProfileService.getDisplayName(profile);
  const initials = UserProfileService.getInitials(profile);

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Card variant="elevated" style={styles.card}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.userDetails}>
              {profile.primarySport} • {profile.experienceLevel}
            </Text>
            <Text style={styles.location}>
              📍 {profile.city}, {profile.state}
            </Text>
          </View>
          <View style={styles.editIcon}>
            <Text style={styles.editIconText}>✏️</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.yearsOfExperience}</Text>
            <Text style={styles.statLabel}>Years Exp.</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.height}cm</Text>
            <Text style={styles.statLabel}>Height</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.weight}kg</Text>
            <Text style={styles.statLabel}>Weight</Text>
          </View>
        </View>

        {profile.currentTeam && (
          <View style={styles.teamContainer}>
            <Text style={styles.teamLabel}>Current Team:</Text>
            <Text style={styles.teamName}>{profile.currentTeam}</Text>
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  card: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3498DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  userDetails: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  location: {
    fontSize: 12,
    color: '#95A5A6',
  },
  editIcon: {
    padding: 8,
  },
  editIconText: {
    fontSize: 18,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E0E0E0',
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  teamLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginRight: 8,
  },
  teamName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3498DB',
    flex: 1,
  },
});