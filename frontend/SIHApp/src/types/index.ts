/**
 * TypeScript type definitions for the SIH app
 * Latest React Native and TypeScript patterns (2024)
 */

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  status: number;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  email: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
}

export interface UserCreate {
  email: string;
  full_name: string;
  is_active?: boolean;
}

export interface UserUpdate {
  email?: string;
  full_name?: string;
  is_active?: boolean;
}

// Item Types
export enum ItemCategory {
  ELECTRONICS = 'electronics',
  CLOTHING = 'clothing',
  BOOKS = 'books',
  HOME = 'home',
  SPORTS = 'sports',
}

export interface Item {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: ItemCategory;
  in_stock: boolean;
  created_at: string;
  updated_at: string;
}

export interface ItemCreate {
  name: string;
  description?: string;
  price: number;
  category: ItemCategory;
  in_stock?: boolean;
}

export interface ItemUpdate {
  name?: string;
  description?: string;
  price?: number;
  category?: ItemCategory;
  in_stock?: boolean;
}

// Navigation Types
export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  ProfileSetup: undefined;
  BasicInfo: undefined;
  LocationInfo: undefined;
  SportsPreferences: undefined;
  SportsGrid: undefined;
  SportDetail: { sportId: string; sportName: string };
  Items: undefined;
  ItemDetail: { itemId: string };
  Users: undefined;
  UserDetail: { userId: string };
};

// Athlete Profile Types
export interface AthleteProfile {
  id: string;
  userId: string;
  // Basic Information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  height: number; // in cm
  weight: number; // in kg
  // Contact & Location
  phone?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  // Sports Information
  primarySport: string;
  secondarySports: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  yearsOfExperience: number;
  currentTeam?: string;
  coachName?: string;
  coachContact?: string;
  // Goals & Preferences
  trainingGoals: string[];
  preferredTrainingTime: 'morning' | 'afternoon' | 'evening';
  availabilityDays: string[];
  // Medical Information
  medicalConditions?: string;
  allergies?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  // Profile Status
  isProfileComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Sport {
  id: string;
  name: string;
  category: 'individual' | 'team';
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

export interface ProfileSetupStep {
  id: number;
  title: string;
  subtitle: string;
  isCompleted: boolean;
  isActive: boolean;
}

// Profile Setup Form Data
export interface BasicInfoForm {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  height: string;
  weight: string;
  phone: string;
}

export interface LocationForm {
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface SportsPreferencesForm {
  primarySport: string;
  secondarySports: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  yearsOfExperience: string;
  currentTeam: string;
  coachName: string;
  coachContact: string;
}

export interface GoalsForm {
  trainingGoals: string[];
  preferredTrainingTime: 'morning' | 'afternoon' | 'evening';
  availabilityDays: string[];
}

export interface EmergencyContactForm {
  medicalConditions: string;
  allergies: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
}

// Common Types
export interface PaginationParams {
  skip?: number;
  limit?: number;
}

export interface ItemFilters extends PaginationParams {
  category?: ItemCategory;
  in_stock?: boolean;
}

export interface UserFilters extends PaginationParams {
  // Add user-specific filters as needed
}