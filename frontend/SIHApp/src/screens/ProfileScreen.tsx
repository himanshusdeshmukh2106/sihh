import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserProfile, UserProfileService } from '../services/UserProfileService';
import { UserProfileCard } from '../components/UserProfileCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Heading2, Heading3, Body1, Body2 } from '../components/ui/Typography';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profile = await UserProfileService.loadProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    navigation.navigate('ProfileSetup');
  };

  const handleClearProfile = () => {
    Alert.alert(
      'Clear Profile',
      'Are you sure you want to clear your profile? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await UserProfileService.clearProfile();
              setUserProfile(null);
              Alert.alert('Success', 'Profile cleared successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear profile');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!userProfile) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Profile Found</Text>
        <Text style={styles.emptySubtitle}>Create your athlete profile to get started</Text>
        <Button
          title="Create Profile"
          onPress={handleEditProfile}
          style={styles.createButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F8FF" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Heading2 align="center" style={styles.title}>
          Your Profile
        </Heading2>

        <UserProfileCard
          profile={userProfile}
          onPress={handleEditProfile}
          style={styles.profileCard}
        />

        {/* Detailed Information Cards */}
        <Card variant="elevated" style={styles.detailCard}>
          <Heading3 style={styles.sectionTitle}>📋 Personal Details</Heading3>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date of Birth:</Text>
            <Text style={styles.detailValue}>{userProfile.dateOfBirth}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Gender:</Text>
            <Text style={styles.detailValue}>{userProfile.gender}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone:</Text>
            <Text style={styles.detailValue}>{userProfile.phone}</Text>
          </View>
        </Card>

        <Card variant="elevated" style={styles.detailCard}>
          <Heading3 style={styles.sectionTitle}>📍 Location</Heading3>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Address:</Text>
            <Text style={styles.detailValue}>{userProfile.address}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>City:</Text>
            <Text style={styles.detailValue}>{userProfile.city}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>State:</Text>
            <Text style={styles.detailValue}>{userProfile.state}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>PIN Code:</Text>
            <Text style={styles.detailValue}>{userProfile.pincode}</Text>
          </View>
        </Card>

        <Card variant="elevated" style={styles.detailCard}>
          <Heading3 style={styles.sectionTitle}>⚽ Sports Information</Heading3>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Primary Sport:</Text>
            <Text style={styles.detailValue}>{userProfile.primarySport}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Experience Level:</Text>
            <Text style={styles.detailValue}>{userProfile.experienceLevel}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Years of Experience:</Text>
            <Text style={styles.detailValue}>{userProfile.yearsOfExperience}</Text>
          </View>
          {userProfile.currentTeam && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Current Team:</Text>
              <Text style={styles.detailValue}>{userProfile.currentTeam}</Text>
            </View>
          )}
          {userProfile.coachName && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Coach:</Text>
              <Text style={styles.detailValue}>{userProfile.coachName}</Text>
            </View>
          )}
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="Edit Profile"
            onPress={handleEditProfile}
            style={styles.editButton}
          />
          <Button
            title="Clear Profile"
            variant="outline"
            onPress={handleClearProfile}
            style={styles.clearButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    marginBottom: 20,
  },
  profileCard: {
    marginBottom: 20,
  },
  detailCard: {
    marginBottom: 15,
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 15,
    color: '#2C3E50',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    flex: 2,
    textAlign: 'right',
    textTransform: 'capitalize',
  },
  actionButtons: {
    marginTop: 20,
    marginBottom: 40,
  },
  editButton: {
    marginBottom: 10,
  },
  clearButton: {
    borderColor: '#E74C3C',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
  },
  loadingText: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 30,
  },
  createButton: {
    minWidth: 200,
  },
});

export default ProfileScreen;