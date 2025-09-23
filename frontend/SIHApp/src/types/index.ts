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
  Items: undefined;
  ItemDetail: { itemId: string };
  Users: undefined;
  UserDetail: { userId: string };
};

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