/**
 * Sports Assessment Platform - Sports and Training Data
 * Contains sports categories, training goals, and related constants
 */

import { Sport, TrainingGoal } from '../types';

export const SPORTS_DATA: Sport[] = [
  // Fitness Assessment
  { id: 'pushups', name: 'Pushup Assessment', category: 'individual', icon: '💪', description: 'AI-powered pushup counter and form analysis', popularityRank: 0 },
  
  // Team Sports
  { id: 'cricket', name: 'Cricket', category: 'team', icon: '🏏', description: 'Bat and ball team sport', popularityRank: 1 },
  { id: 'football', name: 'Football (Soccer)', category: 'team', icon: '⚽', description: 'World\'s most popular sport', popularityRank: 2 },
  { id: 'basketball', name: 'Basketball', category: 'team', icon: '🏀', description: 'High-energy court sport', popularityRank: 3 },
  { id: 'volleyball', name: 'Volleyball', category: 'team', icon: '🏐', description: 'Net-based team sport', popularityRank: 4 },
  { id: 'hockey', name: 'Hockey', category: 'team', icon: '🏑', description: 'Field hockey with sticks', popularityRank: 5 },
  { id: 'kabaddi', name: 'Kabaddi', category: 'team', icon: '🤼', description: 'Traditional contact team sport', popularityRank: 6 },
  { id: 'badminton', name: 'Badminton', category: 'individual', icon: '🏸', description: 'Racquet sport with shuttlecock', popularityRank: 7 },
  
  // Individual Sports
  { id: 'athletics', name: 'Athletics (Track & Field)', category: 'individual', icon: '🏃', description: 'Running, jumping, throwing', popularityRank: 8 },
  { id: 'swimming', name: 'Swimming', category: 'individual', icon: '🏊', description: 'Aquatic racing sport', popularityRank: 9 },
  { id: 'tennis', name: 'Tennis', category: 'individual', icon: '🎾', description: 'Racquet sport on court', popularityRank: 10 },
  { id: 'wrestling', name: 'Wrestling', category: 'individual', icon: '🤼', description: 'Combat grappling sport', popularityRank: 11 },
  { id: 'boxing', name: 'Boxing', category: 'individual', icon: '🥊', description: 'Combat sport with gloves', popularityRank: 12 },
  { id: 'weightlifting', name: 'Weightlifting', category: 'individual', icon: '🏋️', description: 'Olympic lifting sport', popularityRank: 13 },
  { id: 'gymnastics', name: 'Gymnastics', category: 'individual', icon: '🤸', description: 'Artistic movement sport', popularityRank: 14 },
  { id: 'cycling', name: 'Cycling', category: 'individual', icon: '🚴', description: 'Bicycle racing sport', popularityRank: 15 },
  { id: 'archery', name: 'Archery', category: 'individual', icon: '🏹', description: 'Precision bow and arrow', popularityRank: 16 },
  { id: 'shooting', name: 'Shooting', category: 'individual', icon: '🎯', description: 'Target shooting sport', popularityRank: 17 },
  { id: 'judo', name: 'Judo', category: 'individual', icon: '🥋', description: 'Japanese martial art', popularityRank: 18 },
  { id: 'taekwondo', name: 'Taekwondo', category: 'individual', icon: '🥋', description: 'Korean martial art', popularityRank: 19 },
  { id: 'golf', name: 'Golf', category: 'individual', icon: '⛳', description: 'Precision club sport', popularityRank: 20 },
];

export const TRAINING_GOALS: TrainingGoal[] = [
  { id: 'strength', name: 'Build Strength', description: 'Increase overall physical strength', icon: '💪' },
  { id: 'endurance', name: 'Improve Endurance', description: 'Enhance cardiovascular fitness', icon: '🏃' },
  { id: 'speed', name: 'Increase Speed', description: 'Develop faster movement', icon: '⚡' },
  { id: 'agility', name: 'Enhance Agility', description: 'Improve quick direction changes', icon: '🤸' },
  { id: 'flexibility', name: 'Boost Flexibility', description: 'Increase range of motion', icon: '🧘' },
  { id: 'technique', name: 'Perfect Technique', description: 'Master sport-specific skills', icon: '🎯' },
  { id: 'competition', name: 'Competition Prep', description: 'Prepare for competitions', icon: '🏆' },
  { id: 'rehabilitation', name: 'Injury Recovery', description: 'Recover from injury safely', icon: '🩹' },
  { id: 'weight_loss', name: 'Weight Management', description: 'Achieve optimal weight', icon: '⚖️' },
  { id: 'mental', name: 'Mental Training', description: 'Develop mental toughness', icon: '🧠' },
];

export const EXPERIENCE_LEVELS = [
  { value: 'beginner', label: 'Beginner (0-1 years)', description: 'Just starting out' },
  { value: 'intermediate', label: 'Intermediate (2-5 years)', description: 'Some experience' },
  { value: 'advanced', label: 'Advanced (5+ years)', description: 'Highly skilled' },
  { value: 'professional', label: 'Professional', description: 'Competing at highest level' },
];

export const TRAINING_TIMES = [
  { value: 'morning', label: 'Morning (6 AM - 12 PM)', icon: '🌅' },
  { value: 'afternoon', label: 'Afternoon (12 PM - 6 PM)', icon: '☀️' },
  { value: 'evening', label: 'Evening (6 PM - 10 PM)', icon: '🌆' },
];

export const WEEK_DAYS = [
  { value: 'monday', label: 'Monday', short: 'Mon' },
  { value: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { value: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { value: 'thursday', label: 'Thursday', short: 'Thu' },
  { value: 'friday', label: 'Friday', short: 'Fri' },
  { value: 'saturday', label: 'Saturday', short: 'Sat' },
  { value: 'sunday', label: 'Sunday', short: 'Sun' },
];

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male', icon: '♂️' },
  { value: 'female', label: 'Female', icon: '♀️' },
  { value: 'other', label: 'Other', icon: '⚧️' },
];

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
  'Andaman and Nicobar Islands', 'Dadra and Nagar Haveli and Daman and Diu',
  'Lakshadweep'
];

export const HIGHEST_LEVEL_PLAYED = [
  { value: 'district', label: 'District', description: 'District championships' },
  { value: 'state', label: 'State', description: 'State tournaments and championships' },
  { value: 'national', label: 'National', description: 'National championships and competitions' },
  { value: 'international', label: 'International', description: 'International competitions and olympics' },
];