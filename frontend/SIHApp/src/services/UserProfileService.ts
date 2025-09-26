/**
 * UserProfileService - Manages user profile data
 * Handles saving, loading, and updating user profile information
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { BasicInfoForm, LocationForm, SportsPreferencesForm } from '../types';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  height: string;
  weight: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  primarySport: string;
  secondarySports: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  yearsOfExperience: string;
  currentTeam: string;
  coachName: string;
  coachContact: string;
  isProfileComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

const PROFILE_STORAGE_KEY = '@user_profile';

export class UserProfileService {
  /**
   * Save complete user profile
   */
  static async saveProfile(
    basicInfo: BasicInfoForm,
    location: LocationForm,
    sportsPreferences: SportsPreferencesForm
  ): Promise<UserProfile> {
    try {
      const profile: UserProfile = {
        id: Date.now().toString(), // Simple ID generation
        ...basicInfo,
        ...location,
        ...sportsPreferences,
        isProfileComplete: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      console.log('Profile saved successfully:', profile);
      return profile;
    } catch (error) {
      console.error('Error saving profile:', error);
      throw new Error('Failed to save profile');
    }
  }

  /**
   * Load user profile
   */
  static async loadProfile(): Promise<UserProfile | null> {
    try {
      const profileData = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
      if (profileData) {
        const profile = JSON.parse(profileData) as UserProfile;
        console.log('Profile loaded successfully:', profile);
        return profile;
      }
      return null;
    } catch (error) {
      console.error('Error loading profile:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const existingProfile = await this.loadProfile();
      if (!existingProfile) {
        throw new Error('No existing profile found');
      }

      const updatedProfile: UserProfile = {
        ...existingProfile,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
      console.log('Profile updated successfully:', updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error('Failed to update profile');
    }
  }

  /**
   * Check if user has completed profile setup
   */
  static async hasCompletedProfile(): Promise<boolean> {
    try {
      const profile = await this.loadProfile();
      return profile?.isProfileComplete === true;
    } catch (error) {
      console.error('Error checking profile completion:', error);
      return false;
    }
  }

  /**
   * Clear user profile (for logout/reset)
   */
  static async clearProfile(): Promise<void> {
    try {
      await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
      console.log('Profile cleared successfully');
    } catch (error) {
      console.error('Error clearing profile:', error);
      throw new Error('Failed to clear profile');
    }
  }

  /**
   * Get user display name
   */
  static getDisplayName(profile: UserProfile): string {
    return `${profile.firstName} ${profile.lastName}`.trim();
  }

  /**
   * Get user initials for avatar
   */
  static getInitials(profile: UserProfile): string {
    const firstName = profile.firstName?.charAt(0)?.toUpperCase() || '';
    const lastName = profile.lastName?.charAt(0)?.toUpperCase() || '';
    return `${firstName}${lastName}`;
  }
}