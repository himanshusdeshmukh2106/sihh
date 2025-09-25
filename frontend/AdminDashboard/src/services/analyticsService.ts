import { API_BASE_URL, API_ENDPOINTS } from '../utils/constants';
import type { 
  UserAnalytics, 
  SportAnalytics, 
  EngagementMetrics, 
  SystemAnalytics,
  AnalyticsSummary 
} from '../types';

class AnalyticsService {
  private baseURL = API_BASE_URL;

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('admin_auth_token');
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getUserAnalytics(params?: {
    startDate?: string;
    endDate?: string;
    sports?: string[];
  }): Promise<UserAnalytics> {
    const searchParams = new URLSearchParams();
    
    if (params?.startDate) {
      searchParams.append('start_date', params.startDate);
    }
    if (params?.endDate) {
      searchParams.append('end_date', params.endDate);
    }
    if (params?.sports && params.sports.length > 0) {
      params.sports.forEach(sport => searchParams.append('sports', sport));
    }

    const queryString = searchParams.toString();
    const endpoint = `${API_ENDPOINTS.USER_ANALYTICS}${queryString ? `?${queryString}` : ''}`;
    
    return this.request<UserAnalytics>(endpoint);
  }

  async getSportAnalytics(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<SportAnalytics> {
    const searchParams = new URLSearchParams();
    
    if (params?.startDate) {
      searchParams.append('start_date', params.startDate);
    }
    if (params?.endDate) {
      searchParams.append('end_date', params.endDate);
    }

    const queryString = searchParams.toString();
    const endpoint = `${API_ENDPOINTS.SPORT_ANALYTICS}${queryString ? `?${queryString}` : ''}`;
    
    return this.request<SportAnalytics>(endpoint);
  }

  async getEngagementMetrics(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<EngagementMetrics> {
    const searchParams = new URLSearchParams();
    
    if (params?.startDate) {
      searchParams.append('start_date', params.startDate);
    }
    if (params?.endDate) {
      searchParams.append('end_date', params.endDate);
    }

    const queryString = searchParams.toString();
    const endpoint = `${API_ENDPOINTS.ENGAGEMENT_ANALYTICS}${queryString ? `?${queryString}` : ''}`;
    
    return this.request<EngagementMetrics>(endpoint);
  }

  async getSystemAnalytics(): Promise<SystemAnalytics> {
    return this.request<SystemAnalytics>(API_ENDPOINTS.SYSTEM_ANALYTICS);
  }

  async getAnalyticsSummary(params?: {
    startDate?: string;
    endDate?: string;
    sports?: string[];
  }): Promise<AnalyticsSummary> {
    const searchParams = new URLSearchParams();
    
    if (params?.startDate) {
      searchParams.append('start_date', params.startDate);
    }
    if (params?.endDate) {
      searchParams.append('end_date', params.endDate);
    }
    if (params?.sports && params.sports.length > 0) {
      params.sports.forEach(sport => searchParams.append('sports', sport));
    }

    const queryString = searchParams.toString();
    const endpoint = `${API_ENDPOINTS.ANALYTICS_SUMMARY}${queryString ? `?${queryString}` : ''}`;
    
    return this.request<AnalyticsSummary>(endpoint);
  }

  async exportAnalytics(params: {
    startDate?: string;
    endDate?: string;
    sports?: string[];
    format: 'csv' | 'excel' | 'pdf';
  }): Promise<{ message: string; downloadUrl?: string }> {
    const searchParams = new URLSearchParams();
    searchParams.append('format', params.format);
    
    const body = {
      start_date: params.startDate,
      end_date: params.endDate,
      sports: params.sports,
    };

    return this.request<{ message: string; downloadUrl?: string }>(
      `${API_ENDPOINTS.EXPORT_ANALYTICS}?${searchParams.toString()}`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      }
    );
  }
}

export const analyticsService = new AnalyticsService();