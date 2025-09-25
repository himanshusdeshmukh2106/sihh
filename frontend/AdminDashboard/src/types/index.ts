// Authentication types
export interface AdminUser {
  id: number;
  email: string;
  full_name: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: AdminPermission[];
  is_active: boolean;
  last_login: Date;
  created_at: Date;
}

export interface AdminPermission {
  resource: 'users' | 'videos' | 'analytics' | 'system';
  actions: ('read' | 'write' | 'delete' | 'export')[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: AdminUser;
}

// Analytics types
export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

export interface UserAnalytics {
  total_users: number;
  active_users: number;
  new_users_today: number;
  new_users_this_week: number;
  new_users_this_month: number;
  user_growth_rate: number;
  registration_trend: TimeSeriesData[];
  users_by_location: LocationData[];
  users_by_sport: SportData[];
  users_by_experience: ExperienceData[];
}

export interface LocationData {
  location: string;
  count: number;
  percentage: number;
}

export interface SportData {
  sport: string;
  count: number;
  percentage: number;
  growth: number;
}

export interface ExperienceData {
  level: string;
  count: number;
  percentage: number;
}

// User management types
export interface User {
  id: number;
  email: string;
  full_name: string;
  phone_number?: string;
  location?: string;
  sports: string[];
  experience_level: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  is_active: boolean;
  created_at: Date;
  last_login?: Date;
}

export interface AdminUserView extends User {
  activitySummary: {
    lastLogin: Date;
    sessionCount: number;
    totalVideoViews: number;
    profileCompleteness: number;
  };
  moderationFlags: {
    reportCount: number;
    warningCount: number;
    suspensionHistory: SuspensionRecord[];
  };
  engagementMetrics: {
    averageSessionDuration: number;
    featuresUsed: string[];
    lastActivity: Date;
  };
}

export interface SuspensionRecord {
  id: string;
  reason: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  createdBy: string;
}

// Video content types
export type VideoStatus = 'active' | 'pending' | 'flagged' | 'removed';
export type ModerationStatus = 'unreviewed' | 'approved' | 'rejected';

export interface VideoContent {
  id: string;
  title: string;
  description: string;
  sport: string;
  category: string;
  uploadedBy: string;
  uploadDate: Date;
  duration: number;
  fileSize: number;
  viewCount: number;
  likeCount: number;
  status: VideoStatus;
  moderationStatus: ModerationStatus;
  moderationFlags: ModerationFlag[];
  thumbnailUrl: string;
  videoUrl: string;
  tags: string[];
}

export interface ModerationFlag {
  id: string;
  type: 'inappropriate' | 'copyright' | 'spam' | 'other';
  reason: string;
  reportedBy: string;
  reportedAt: Date;
  status: 'pending' | 'resolved' | 'dismissed';
  reviewedBy?: string;
  reviewedAt?: Date;
}

// System types
export interface SystemAnalytics {
  apiMetrics: {
    totalRequests: number;
    averageResponseTime: number;
    errorRate: number;
    uptime: number;
  };
  databaseMetrics: {
    connectionCount: number;
    queryPerformance: number;
    storageUsed: number;
    storageTotal: number;
  };
  performanceAlerts: Alert[];
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

// Analytics types (additional)
export interface SportAnalytics {
  sport_popularity: SportData[];
  sport_growth_trends: TimeSeriesData[];
  sport_engagement: Array<{ sport: string; engagement_score: number }>;
  top_sports: SportData[];
}

export interface EngagementMetrics {
  total_sessions: number;
  average_session_duration: number;
  bounce_rate: number;
  retention_rate: number;
  daily_active_users: number;
  weekly_active_users: number;
  monthly_active_users: number;
  session_trend: TimeSeriesData[];
  feature_usage: Array<{ feature: string; usage_count: number }>;
}

export interface AnalyticsSummary {
  userAnalytics: UserAnalytics;
  sportAnalytics: SportAnalytics;
  engagementMetrics: EngagementMetrics;
  systemAnalytics: SystemAnalytics;
  generatedAt: Date;
}

// Common UI types
export interface TableColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}