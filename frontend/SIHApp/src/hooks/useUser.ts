/**
 * useUser - Simple hook for managing user context
 * In a real app, this would integrate with authentication
 */

import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

// Mock user for development
const MOCK_USER: User = {
  id: 'user_123',
  name: 'Test User',
  email: 'test@example.com'
};

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    const loadUser = async () => {
      try {
        // In a real app, this would fetch from authentication service
        await new Promise(resolve => setTimeout(resolve, 500));
        setUser(MOCK_USER);
      } catch (error) {
        console.error('Failed to load user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const getCurrentUserId = (): string => {
    return user?.id || 'anonymous_user';
  };

  return {
    user,
    isLoading,
    getCurrentUserId
  };
};