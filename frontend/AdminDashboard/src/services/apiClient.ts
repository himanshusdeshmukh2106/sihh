import { API_BASE_URL } from '../utils/constants';

interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
}

interface RequestConfig {
  headers?: Record<string, string>;
  responseType?: 'json' | 'blob';
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('admin_auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit & RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const { responseType = 'json', headers = {}, ...fetchOptions } = options;
    
    const url = `${this.baseURL}${endpoint}`;
    
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        ...this.getAuthHeaders(),
        ...headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
    }

    let data: T;
    if (responseType === 'blob') {
      data = (await response.blob()) as T;
    } else {
      data = await response.json();
    }

    return {
      data,
      status: response.status,
      statusText: response.statusText,
    };
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET', ...config });
  }

  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });
  }

  async patch<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });
  }

  async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...config,
    });
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE', ...config });
  }
}

export const apiClient = new ApiClient();
export default apiClient;