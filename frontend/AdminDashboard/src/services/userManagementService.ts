import { apiClient } from './apiClient';
import type { 
  User, 
  UserStatus, 
  PaginatedResponse,
  UserActivity,
  UserSearchFilters 
} from '../types';

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  sport?: string;
  status?: string;
  experience_level?: string;
  location?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface UserStatusUpdateRequest {
  status: UserStatus;
  reason?: string;
}

export interface UserSearchRequest {
  query?: string;
  sports?: string[];
  experience_levels?: string[];
  locations?: string[];
  age_range?: { min?: number; max?: number };
  gender?: string;
  is_active?: boolean;
  profile_completed?: boolean;
  created_after?: string;
  created_before?: string;
  limit?: number;
}

export interface UserActivitySummary {
  user_id: number;
  total_sessions: number;
  last_activity?: string;
  profile_completion_percentage: number;
  engagement_score: number;
  activity_timeline: Array<{
    date: string;
    activity: string;
    details: string;
  }>;
  sessions_this_week: number;
  sessions_this_month: number;
  average_session_duration: number;
  features_used: string[];
}

export interface UserStats {
  total_users: number;
  active_users: number;
  completed_profiles: number;
  new_users_this_month: number;
  completion_rate: number;
  top_sports: Array<{ sport: string; count: number }>;
}

class UserManagementService {
  private baseUrl = '/api/v1/admin/users';

  async getUsers(params: UserListParams = {}): Promise<PaginatedResponse<User>> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`${this.baseUrl}?${searchParams.toString()}`);
    return response.data;
  }

  async getUserById(id: number): Promise<User> {
    const response = await apiClient.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async updateUserStatus(id: number, update: UserStatusUpdateRequest): Promise<User> {
    const response = await apiClient.patch(`${this.baseUrl}/${id}/status`, update);
    return response.data;
  }

  async getUserActivity(id: number, days: number = 30): Promise<UserActivitySummary> {
    const response = await apiClient.get(`${this.baseUrl}/${id}/activity?days=${days}`);
    return response.data;
  }

  async searchUsers(request: UserSearchRequest): Promise<User[]> {
    const response = await apiClient.post(`${this.baseUrl}/search`, request);
    return response.data;
  }

  async deleteUser(id: number, permanent: boolean = false): Promise<{ message: string }> {
    const response = await apiClient.delete(`${this.baseUrl}/${id}?permanent=${permanent}`);
    return response.data;
  }

  async getUserStats(): Promise<UserStats> {
    const response = await apiClient.get(`${this.baseUrl}/stats/summary`);
    return response.data;
  }

  async bulkUpdateUsers(userIds: number[], action: string, reason?: string): Promise<{ message: string }> {
    const response = await apiClient.post(`${this.baseUrl}/bulk-action`, {
      user_ids: userIds,
      action,
      reason
    });
    return response.data;
  }

  async exportUsers(filters?: UserSearchFilters, format: 'csv' | 'excel' | 'json' = 'csv'): Promise<Blob> {
    const response = await apiClient.post(`${this.baseUrl}/export`, {
      filters,
      format
    }, {
      responseType: 'blob'
    });
    return response.data;
  }

  // Advanced filtering and search
  async getFilterOptions(): Promise<{
    sports: string[];
    experience_levels: string[];
    locations: string[];
  }> {
    const response = await apiClient.get(`${this.baseUrl}/filter-options`);
    return response.data;
  }

  // User engagement metrics
  async getUserEngagementMetrics(timeRange: string = '30d'): Promise<{
    active_users: number;
    engagement_rate: number;
    retention_rate: number;
    churn_rate: number;
    top_features: Array<{ feature: string; usage_count: number }>;
  }> {
    const response = await apiClient.get(`${this.baseUrl}/engagement-metrics?range=${timeRange}`);
    return response.data;
  }

  // User demographics
  async getUserDemographics(): Promise<{
    age_distribution: Array<{ age_range: string; count: number }>;
    gender_distribution: Array<{ gender: string; count: number }>;
    location_distribution: Array<{ location: string; count: number }>;
    sport_distribution: Array<{ sport: string; count: number }>;
  }> {
    const response = await apiClient.get(`${this.baseUrl}/demographics`);
    return response.data;
  }

  // User activity timeline
  async getUserTimeline(id: number, limit: number = 50): Promise<Array<{
    id: number;
    timestamp: string;
    activity_type: string;
    description: string;
    metadata?: Record<string, any>;
  }>> {
    const response = await apiClient.get(`${this.baseUrl}/${id}/timeline?limit=${limit}`);
    return response.data;
  }

  // User moderation actions
  async flagUser(id: number, reason: string, severity: 'low' | 'medium' | 'high'): Promise<{ message: string }> {
    const response = await apiClient.post(`${this.baseUrl}/${id}/flag`, {
      reason,
      severity
    });
    return response.data;
  }

  async unflagUser(id: number, reason?: string): Promise<{ message: string }> {
    const response = await apiClient.post(`${this.baseUrl}/${id}/unflag`, {
      reason
    });
    return response.data;
  }

  // User communication
  async sendNotification(userIds: number[], message: string, type: 'info' | 'warning' | 'success' | 'error' = 'info'): Promise<{ message: string }> {
    const response = await apiClient.post(`${this.baseUrl}/notify`, {
      user_ids: userIds,
      message,
      type
    });
    return response.data;
  }

  // User data export for GDPR compliance
  async exportUserData(id: number): Promise<Blob> {
    const response = await apiClient.get(`${this.baseUrl}/${id}/export-data`, {
      responseType: 'blob'
    });
    return response.data;
  }

  // User account recovery
  async resetUserPassword(id: number): Promise<{ message: string; temporary_password?: string }> {
    const response = await apiClient.post(`${this.baseUrl}/${id}/reset-password`);
    return response.data;
  }

  async unlockUserAccount(id: number): Promise<{ message: string }> {
    const response = await apiClient.post(`${this.baseUrl}/${id}/unlock`);
    return response.data;
  }
}

export const userManagementService = new UserManagementService();