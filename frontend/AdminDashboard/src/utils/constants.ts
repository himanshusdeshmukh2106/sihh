// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
export const API_ENDPOINTS = {
    // Auth endpoints
    LOGIN: '/api/v1/admin/auth/login',
    LOGOUT: '/api/v1/admin/auth/logout',
    REFRESH: '/api/v1/admin/auth/refresh',
    ME: '/api/v1/admin/auth/me',

    // Analytics endpoints
    USER_ANALYTICS: '/api/v1/admin/analytics/users',
    SPORT_ANALYTICS: '/api/v1/admin/analytics/sports',
    ENGAGEMENT_ANALYTICS: '/api/v1/admin/analytics/engagement',
    SYSTEM_ANALYTICS: '/api/v1/admin/analytics/system',
    ANALYTICS_SUMMARY: '/api/v1/admin/analytics/summary',

    // User management endpoints
    USERS: '/api/v1/admin/users',
    USER_DETAIL: '/api/v1/admin/users/:id',
    USER_SUSPEND: '/api/v1/admin/users/:id/suspend',
    USER_ACTIVATE: '/api/v1/admin/users/:id/activate',

    // Content management endpoints
    VIDEOS: '/api/v1/admin/videos',
    VIDEO_DETAIL: '/api/v1/admin/videos/:id',
    VIDEO_MODERATE: '/api/v1/admin/videos/:id/moderate',

    // Export endpoints
    EXPORT_USERS: '/api/v1/admin/export/users',
    EXPORT_ANALYTICS: '/api/v1/admin/export/analytics',
} as const;

// Sports categories
export const SPORTS_CATEGORIES = [
    'Football',
    'Basketball',
    'Cricket',
    'Tennis',
    'Badminton',
    'Swimming',
    'Running',
    'Cycling',
    'Yoga',
    'Gym',
    'Boxing',
    'Wrestling',
    'Hockey',
    'Volleyball',
    'Table Tennis',
] as const;

// Experience levels
export const EXPERIENCE_LEVELS = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'professional', label: 'Professional' },
] as const;

// User status options
export const USER_STATUS_OPTIONS = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' },
] as const;

// Date range presets
export const DATE_RANGE_PRESETS = [
    { label: 'Last 7 days', value: 'last7days' },
    { label: 'Last 30 days', value: 'last30days' },
    { label: 'Last 3 months', value: 'last3months' },
    { label: 'Last 6 months', value: 'last6months' },
    { label: 'Last year', value: 'lastyear' },
    { label: 'Custom range', value: 'custom' },
] as const;

// Chart colors
export const CHART_COLORS = {
    primary: '#3182CE',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    purple: '#8B5CF6',
    cyan: '#06B6D4',
    pink: '#EC4899',
    indigo: '#6366F1',
} as const;

// Pagination defaults
export const PAGINATION_DEFAULTS = {
    PAGE_SIZE: 20,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// Local storage keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'admin_auth_token',
    USER_PREFERENCES: 'admin_user_preferences',
    FILTERS: 'admin_filters',
} as const;