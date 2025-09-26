/**
 * TypeScript type definitions for the SIH App
 */

// Navigation types
export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  ProfileSetup: undefined;
  SportsGrid: undefined;
  SportDetail: {
    sportId: string;
    sportName: string;
  };
  PushupAssessment: {
    sportId: string;
    sportName: string;
    experienceLevel: number;
    highestLevel: string;
  };
  AssessmentResults: {
    totalPushups: number;
    duration: number;
    assessmentData: AssessmentSession;
  };
  Items: undefined;
  ItemDetail: { id: string };
  Users: undefined;
  UserDetail: { id: string };
};

// Assessment data types
export interface AssessmentSession {
  id: string;
  userId: string;
  sportId: string;
  totalPushups: number;
  duration: number;
  timestamp: Date;
  experienceLevel: number;
  highestLevel: string;
}

// Pushup detection types
export interface PushupDetectionState {
  isInitialized: boolean;
  isDetecting: boolean;
  currentCount: number;
  sessionStartTime: Date | null;
  lastDetectionTime: Date | null;
  detectionConfidence: number;
  bodyKeypoints: Keypoint[];
}

export interface Keypoint {
  x: number;
  y: number;
  confidence: number;
  name: string;
}

export interface AssessmentConfiguration {
  detectionThreshold: number;
  minimumPushupDuration: number;
  maxSessionDuration: number;
  requiredKeypoints: string[];
  formValidationEnabled: boolean;
}

// Detection feedback types
export type DetectionFeedback = 'good' | 'adjust_position' | 'not_detected';

// Form validation types
export interface FormValidationResult {
  isValid: boolean;
  score: number; // 0-100
  feedback: string[];
}

// Exercise statistics
export interface ExerciseStats {
  count: number;
  totalTime: number;
  avgDuration: number;
  bestFormScore: number;
  caloriesBurned: number;
}

// Sports data types
export interface Sport {
  id: string;
  name: string;
  category: 'team' | 'individual';
  icon: string;
  description: string;
  popularityRank: number;
}

export interface TrainingGoal {
  id: string;
  name: string;
  description: string;
  icon: string;
}