/**
 * ProfileSetupScreen - Sports Assessment Platform
 * Simplified 3-step profile setup with GPS location and football background
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import * as Location from 'expo-location';
import { StepProgress } from '../components/StepProgress';
import { CustomInput, PickerInput } from '../components/CustomInput';
import { UserProfileService } from '../services/UserProfileService';

import {
  ProfileSetupStep,
  BasicInfoForm,
  LocationForm,
  SportsPreferencesForm,
} from '../types';
import {
  GENDER_OPTIONS,
  INDIAN_STATES,
  EXPERIENCE_LEVELS,

} from '../data/sportsData';

const SETUP_STEPS: ProfileSetupStep[] = [
  { id: 1, title: 'Basic Info', subtitle: 'Personal details', isCompleted: false, isActive: true },
  { id: 2, title: 'Location', subtitle: 'Address info', isCompleted: false, isActive: false },
  { id: 3, title: 'Sports', subtitle: 'Preferences', isCompleted: false, isActive: false },
];

type ProfileSetupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProfileSetup'>;

export const ProfileSetupScreen: React.FC = () => {
  const navigation = useNavigation<ProfileSetupScreenNavigationProp>();
  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState(SETUP_STEPS);
  const [locationLoading, setLocationLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);

  // Form data states
  const [basicInfo, setBasicInfo] = useState<BasicInfoForm>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'male',
    height: '',
    weight: '',
    phone: '',
  });

  const [location, setLocation] = useState<LocationForm>({
    address: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
  });

  const [sportsPreferences, setSportsPreferences] = useState<SportsPreferencesForm>({
    primarySport: '',
    secondarySports: [],
    experienceLevel: 'beginner',
    yearsOfExperience: '',
    currentTeam: '',
    coachName: '',
    coachContact: '',
  });

  // Update step progress
  const updateStepProgress = (stepId: number, isCompleted: boolean, isActive: boolean) => {
    setSteps(prevSteps =>
      prevSteps.map(step => ({
        ...step,
        isCompleted: step.id < stepId ? true : step.id === stepId ? isCompleted : false,
        isActive: step.id === stepId ? isActive : false,
      }))
    );
  };

  // Load existing profile data when component mounts
  useEffect(() => {
    const loadExistingProfile = async () => {
      try {
        setProfileLoading(true);
        const existingProfile = await UserProfileService.loadProfile();
        if (existingProfile) {
          // Pre-fill form with existing data
          setBasicInfo({
            firstName: existingProfile.firstName,
            lastName: existingProfile.lastName,
            dateOfBirth: existingProfile.dateOfBirth,
            gender: existingProfile.gender,
            height: existingProfile.height,
            weight: existingProfile.weight,
            phone: existingProfile.phone,
          });
          
          setLocation({
            address: existingProfile.address,
            city: existingProfile.city,
            state: existingProfile.state,
            country: existingProfile.country,
            pincode: existingProfile.pincode,
          });
          
          setSportsPreferences({
            primarySport: existingProfile.primarySport,
            secondarySports: existingProfile.secondarySports,
            experienceLevel: existingProfile.experienceLevel,
            yearsOfExperience: existingProfile.yearsOfExperience,
            currentTeam: existingProfile.currentTeam,
            coachName: existingProfile.coachName,
            coachContact: existingProfile.coachContact,
          });
          
          console.log('Existing profile loaded and form pre-filled');
        }
      } catch (error) {
        console.error('Error loading existing profile:', error);
        // Continue with empty form if loading fails
      } finally {
        setProfileLoading(false);
      }
    };

    loadExistingProfile();
  }, []);

  useEffect(() => {
    updateStepProgress(currentStep, false, true);
  }, [currentStep]);

  // GPS Location fetching
  const fetchCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Location permission is needed to auto-fill your address. Please enable it in settings.'
        );
        setLocationLoading(false);
        return;
      }

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Reverse geocode to get address
      const addressData = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (addressData && addressData.length > 0) {
        const address = addressData[0];
        setLocation({
          address: `${address.street || ''} ${address.streetNumber || ''}`.trim(),
          city: address.city || address.subregion || '',
          state: address.region || '',
          country: address.country || 'India',
          pincode: address.postalCode || '',
        });
        
        Alert.alert('Success! 📍', 'Your location has been auto-filled.');
      }
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Please fill in manually.'
      );
    } finally {
      setLocationLoading(false);
    }
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!(basicInfo.firstName && basicInfo.lastName && basicInfo.dateOfBirth && basicInfo.phone);
      case 2:
        return !!(location.address && location.city && location.state && location.pincode);
      case 3:
        return !!(sportsPreferences.primarySport && sportsPreferences.yearsOfExperience);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      Alert.alert('Incomplete Information', 'Please fill in all required fields before proceeding.');
      return;
    }

    if (currentStep < 3) {
      updateStepProgress(currentStep, true, false);
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3) {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Save profile data using UserProfileService
      const savedProfile = await UserProfileService.saveProfile(
        basicInfo,
        location,
        sportsPreferences
      );

      console.log('Profile saved:', savedProfile);
      
      // Check if this was an update or new profile
      const existingProfile = await UserProfileService.loadProfile();
      const isUpdate = existingProfile && existingProfile.id !== savedProfile.id;
      
      Alert.alert(
        isUpdate ? 'Profile Updated! ✅' : 'Profile Complete! 🎉',
        isUpdate 
          ? 'Your athlete profile has been updated successfully.'
          : 'Your athlete profile has been set up successfully.',
        [
          {
            text: 'Continue',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } catch (error) {
      console.error('Profile save error:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInfoStep();
      case 2:
        return renderLocationStep();
      case 3:
        return renderSportsStep();
      default:
        return null;
    }
  };

  const renderBasicInfoStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>👤 Basic Information</Text>
      <Text style={styles.stepSubtitle}>Tell us about yourself</Text>

      <View style={styles.row}>
        <CustomInput
          label="First Name"
          value={basicInfo.firstName}
          onChangeText={(text) => setBasicInfo({...basicInfo, firstName: text})}
          icon="🏷️"
          required
          containerStyle={styles.halfInput}
        />
        <CustomInput
          label="Last Name"
          value={basicInfo.lastName}
          onChangeText={(text) => setBasicInfo({...basicInfo, lastName: text})}
          required
          containerStyle={styles.halfInput}
        />
      </View>

      <CustomInput
        label="Date of Birth"
        value={basicInfo.dateOfBirth}
        onChangeText={(text) => setBasicInfo({...basicInfo, dateOfBirth: text})}
        placeholder="DD/MM/YYYY"
        icon="📅"
        required
      />

      <PickerInput
        label="Gender"
        value={basicInfo.gender}
        options={GENDER_OPTIONS}
        onSelect={(value) => setBasicInfo({...basicInfo, gender: value as any})}
        icon="⚧️"
        required
      />

      <View style={styles.row}>
        <CustomInput
          label="Height (cm)"
          value={basicInfo.height}
          onChangeText={(text) => setBasicInfo({...basicInfo, height: text})}
          inputType="number"
          icon="📏"
          containerStyle={styles.halfInput}
        />
        <CustomInput
          label="Weight (kg)"
          value={basicInfo.weight}
          onChangeText={(text) => setBasicInfo({...basicInfo, weight: text})}
          inputType="number"
          icon="⚖️"
          containerStyle={styles.halfInput}
        />
      </View>

      <CustomInput
        label="Phone Number"
        value={basicInfo.phone}
        onChangeText={(text) => setBasicInfo({...basicInfo, phone: text})}
        inputType="phone"
        icon="📱"
        required
      />
    </View>
  );

  const renderLocationStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>📍 Location Information</Text>
      <Text style={styles.stepSubtitle}>Where are you located?</Text>

      <TouchableOpacity
        style={styles.gpsButton}
        onPress={fetchCurrentLocation}
        disabled={locationLoading}
      >
        {locationLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Text style={styles.gpsIcon}>🌍</Text>
            <Text style={styles.gpsButtonText}>Use My Current Location</Text>
          </>
        )}
      </TouchableOpacity>

      <CustomInput
        label="Address"
        value={location.address}
        onChangeText={(text) => setLocation({...location, address: text})}
        icon="🏠"
        required
        multiline
        numberOfLines={3}
      />

      <View style={styles.row}>
        <CustomInput
          label="City"
          value={location.city}
          onChangeText={(text) => setLocation({...location, city: text})}
          icon="🏙️"
          required
          containerStyle={styles.halfInput}
        />
        <CustomInput
          label="PIN Code"
          value={location.pincode}
          onChangeText={(text) => setLocation({...location, pincode: text})}
          inputType="number"
          icon="📮"
          required
          containerStyle={styles.halfInput}
        />
      </View>

      <PickerInput
        label="State"
        value={location.state}
        options={INDIAN_STATES.map(state => ({ label: state, value: state }))}
        onSelect={(value) => setLocation({...location, state: value})}
        icon="🗺️"
        required
      />

      <CustomInput
        label="Country"
        value={location.country}
        onChangeText={(text) => setLocation({...location, country: text})}
        icon="🌍"
        editable={false}
      />
    </View>
  );

  const renderSportsStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>⚽ Sports Preferences</Text>
      <Text style={styles.stepSubtitle}>What sports do you love?</Text>

      <CustomInput
        label="Primary Sport"
        value={sportsPreferences.primarySport}
        onChangeText={(text) => setSportsPreferences({...sportsPreferences, primarySport: text})}
        placeholder="e.g., Football, Cricket, Basketball"
        icon="⚽"
        required
      />

      <PickerInput
        label="Experience Level"
        value={sportsPreferences.experienceLevel}
        options={EXPERIENCE_LEVELS}
        onSelect={(value) => setSportsPreferences({...sportsPreferences, experienceLevel: value as any})}
        icon="🏆"
        required
      />

      <CustomInput
        label="Years of Experience"
        value={sportsPreferences.yearsOfExperience}
        onChangeText={(text) => setSportsPreferences({...sportsPreferences, yearsOfExperience: text})}
        inputType="number"
        icon="📊"
        required
      />

      <CustomInput
        label="Current Team (Optional)"
        value={sportsPreferences.currentTeam}
        onChangeText={(text) => setSportsPreferences({...sportsPreferences, currentTeam: text})}
        icon="👥"
      />

      <CustomInput
        label="Coach Name (Optional)"
        value={sportsPreferences.coachName}
        onChangeText={(text) => setSportsPreferences({...sportsPreferences, coachName: text})}
        icon="👨‍🏫"
      />
    </View>
  );

  // Show loading screen while profile is being loaded
  if (profileLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498DB" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Football Background Image */}
      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1993&q=80'
        }}
        style={styles.footballBackground}
        resizeMode="cover"
      />
      
      {/* Content Overlay */}
      <View style={styles.overlay}>
        {/* Step Progress at Top */}
        <View style={styles.topContainer}>
          <StepProgress steps={steps} />
        </View>
        
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.contentContainer}>
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollContent}
            >
              {renderStepContent()}
            </ScrollView>

            <View style={styles.buttonContainer}>
              {currentStep > 1 && (
                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={handlePrevious}
                >
                  <Text style={styles.secondaryButtonText}>← Previous</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={handleNext}
              >
                <Text style={styles.primaryButtonText}>
                  {currentStep === 3 ? 'Complete Setup 🎉' : 'Next →'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  footballBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.15,
    zIndex: 0,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    zIndex: 1,
    paddingTop: 40,
  },
  topContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  keyboardContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  sportSelector: {
    marginBottom: 30,
    maxHeight: 300,
  },

  gpsButton: {
    backgroundColor: '#27AE60',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 25,
    shadowColor: '#27AE60',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gpsIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  gpsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  primaryButton: {
    backgroundColor: '#3498DB',
    shadowColor: '#3498DB',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 2,
    borderColor: '#BDC3C7',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#7F8C8D',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#7F8C8D',
  },
});