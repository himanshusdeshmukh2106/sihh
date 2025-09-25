import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { DateRange } from '../types';

interface FilterState {
  selectedSports: string[];
  dateRange?: DateRange;
  dateRangePreset: string;
  searchQuery: string;
  userStatus: string[];
  experienceLevel: string[];
}

type FilterAction =
  | { type: 'SET_SPORTS'; payload: string[] }
  | { type: 'SET_DATE_RANGE_PRESET'; payload: string }
  | { type: 'SET_DATE_RANGE'; payload: DateRange }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_USER_STATUS'; payload: string[] }
  | { type: 'SET_EXPERIENCE_LEVEL'; payload: string[] }
  | { type: 'RESET_FILTERS' }
  | { type: 'LOAD_FROM_URL'; payload: Partial<FilterState> };

interface FilterContextType extends FilterState {
  setSports: (sports: string[]) => void;
  setDateRangePreset: (preset: string) => void;
  setDateRange: (range: DateRange) => void;
  setSearchQuery: (query: string) => void;
  setUserStatus: (status: string[]) => void;
  setExperienceLevel: (level: string[]) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

// Helper function to get date range from preset
const getDateRangeFromPreset = (preset: string): DateRange => {
  const now = new Date();
  const start = new Date();
  
  switch (preset) {
    case 'last7days':
      start.setDate(now.getDate() - 7);
      break;
    case 'last30days':
      start.setDate(now.getDate() - 30);
      break;
    case 'last3months':
      start.setMonth(now.getMonth() - 3);
      break;
    case 'last6months':
      start.setMonth(now.getMonth() - 6);
      break;
    case 'lastyear':
      start.setFullYear(now.getFullYear() - 1);
      break;
    default:
      start.setDate(now.getDate() - 30);
  }
  
  return { start, end: now };
};

const initialState: FilterState = {
  selectedSports: [],
  dateRange: getDateRangeFromPreset('last30days'),
  dateRangePreset: 'last30days',
  searchQuery: '',
  userStatus: [],
  experienceLevel: []
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_SPORTS':
      return { ...state, selectedSports: action.payload };
    case 'SET_DATE_RANGE_PRESET':
      return { 
        ...state, 
        dateRangePreset: action.payload,
        dateRange: getDateRangeFromPreset(action.payload)
      };
    case 'SET_DATE_RANGE':
      return { ...state, dateRange: action.payload, dateRangePreset: 'custom' };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_USER_STATUS':
      return { ...state, userStatus: action.payload };
    case 'SET_EXPERIENCE_LEVEL':
      return { ...state, experienceLevel: action.payload };
    case 'RESET_FILTERS':
      return { ...initialState };
    case 'LOAD_FROM_URL':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

interface FilterProviderProps {
  children: React.ReactNode;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(filterReducer, initialState);
  const [searchParams, setSearchParams] = useSearchParams();

  // Load filters from URL on mount
  useEffect(() => {
    const urlFilters: Partial<FilterState> = {};
    
    const sports = searchParams.get('sports');
    if (sports) {
      urlFilters.selectedSports = sports.split(',');
    }
    
    const dateRangePreset = searchParams.get('dateRange');
    if (dateRangePreset) {
      urlFilters.dateRangePreset = dateRangePreset;
      urlFilters.dateRange = getDateRangeFromPreset(dateRangePreset);
    }
    
    const search = searchParams.get('search');
    if (search) {
      urlFilters.searchQuery = search;
    }
    
    const status = searchParams.get('status');
    if (status) {
      urlFilters.userStatus = status.split(',');
    }
    
    const experience = searchParams.get('experience');
    if (experience) {
      urlFilters.experienceLevel = experience.split(',');
    }
    
    if (Object.keys(urlFilters).length > 0) {
      dispatch({ type: 'LOAD_FROM_URL', payload: urlFilters });
    }
  }, [searchParams]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (state.selectedSports.length > 0) {
      params.set('sports', state.selectedSports.join(','));
    }
    
    if (state.dateRangePreset !== 'last30days') {
      params.set('dateRange', state.dateRangePreset);
    }
    
    if (state.searchQuery) {
      params.set('search', state.searchQuery);
    }
    
    if (state.userStatus.length > 0) {
      params.set('status', state.userStatus.join(','));
    }
    
    if (state.experienceLevel.length > 0) {
      params.set('experience', state.experienceLevel.join(','));
    }
    
    setSearchParams(params, { replace: true });
  }, [state, setSearchParams]);

  const setSports = (sports: string[]) => {
    dispatch({ type: 'SET_SPORTS', payload: sports });
  };

  const setDateRangePreset = (preset: string) => {
    dispatch({ type: 'SET_DATE_RANGE_PRESET', payload: preset });
  };

  const setDateRange = (range: DateRange) => {
    dispatch({ type: 'SET_DATE_RANGE', payload: range });
  };

  const setSearchQuery = (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  const setUserStatus = (status: string[]) => {
    dispatch({ type: 'SET_USER_STATUS', payload: status });
  };

  const setExperienceLevel = (level: string[]) => {
    dispatch({ type: 'SET_EXPERIENCE_LEVEL', payload: level });
  };

  const resetFilters = () => {
    dispatch({ type: 'RESET_FILTERS' });
  };

  const hasActiveFilters = 
    state.selectedSports.length > 0 ||
    state.dateRangePreset !== 'last30days' ||
    state.searchQuery !== '' ||
    state.userStatus.length > 0 ||
    state.experienceLevel.length > 0;

  const value: FilterContextType = {
    ...state,
    setSports,
    setDateRangePreset,
    setDateRange,
    setSearchQuery,
    setUserStatus,
    setExperienceLevel,
    resetFilters,
    hasActiveFilters
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = (): FilterContextType => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};