/**
 * API Service for SIH App
 * Modern axios configuration with TypeScript
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  UserCreate,
  UserUpdate,
  Item,
  ItemCreate,
  ItemUpdate,
  ItemFilters,
  UserFilters,
  ItemCategory,
} from '../types';

// API Configuration
const API_BASE_URL = 'http://localhost:8000'; // Change to your actual backend URL
const API_VERSION = '/api/v1';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}${API_VERSION}`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, clear storage and redirect to login
          await AsyncStorage.removeItem('access_token');
          await AsyncStorage.removeItem('user_data');
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication Endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response: AxiosResponse<LoginResponse> = await this.api.post(
      '/auth/login',
      credentials
    );
    
    // Store token in AsyncStorage
    await AsyncStorage.setItem('access_token', response.data.access_token);
    
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.post(
      '/auth/register',
      userData
    );
    return response.data;
  }

  async logout(): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.post(
      '/auth/logout'
    );
    
    // Clear local storage
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('user_data');
    
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get('/auth/me');
    return response.data;
  }

  // User Management Endpoints
  async getUsers(filters?: UserFilters): Promise<User[]> {
    const params = new URLSearchParams();
    if (filters?.skip) params.append('skip', filters.skip.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response: AxiosResponse<User[]> = await this.api.get(
      `/users?${params.toString()}`
    );
    return response.data;
  }

  async getUser(userId: string): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get(`/users/${userId}`);
    return response.data;
  }

  async createUser(userData: UserCreate): Promise<User> {
    const response: AxiosResponse<User> = await this.api.post('/users', userData);
    return response.data;
  }

  async updateUser(userId: string, userData: UserUpdate): Promise<User> {
    const response: AxiosResponse<User> = await this.api.put(
      `/users/${userId}`,
      userData
    );
    return response.data;
  }

  async deleteUser(userId: string): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.delete(
      `/users/${userId}`
    );
    return response.data;
  }

  // Item Management Endpoints
  async getItems(filters?: ItemFilters): Promise<Item[]> {
    const params = new URLSearchParams();
    if (filters?.skip) params.append('skip', filters.skip.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.category) params.append('category', filters.category);
    if (filters?.in_stock !== undefined) {
      params.append('in_stock', filters.in_stock.toString());
    }

    const response: AxiosResponse<Item[]> = await this.api.get(
      `/items?${params.toString()}`
    );
    return response.data;
  }

  async getItem(itemId: string): Promise<Item> {
    const response: AxiosResponse<Item> = await this.api.get(`/items/${itemId}`);
    return response.data;
  }

  async createItem(itemData: ItemCreate): Promise<Item> {
    const response: AxiosResponse<Item> = await this.api.post('/items', itemData);
    return response.data;
  }

  async updateItem(itemId: string, itemData: ItemUpdate): Promise<Item> {
    const response: AxiosResponse<Item> = await this.api.put(
      `/items/${itemId}`,
      itemData
    );
    return response.data;
  }

  async deleteItem(itemId: string): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.delete(
      `/items/${itemId}`
    );
    return response.data;
  }

  async getCategories(): Promise<string[]> {
    const response: AxiosResponse<string[]> = await this.api.get('/items/categories');
    return response.data;
  }

  // Health Check
  async healthCheck(): Promise<ApiResponse<any>> {
    const response: AxiosResponse<ApiResponse<any>> = await this.api.get('/');
    return response.data;
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;