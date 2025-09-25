import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface UseSessionTimeoutOptions {
  timeoutMinutes?: number;
  warningMinutes?: number;
  onWarning?: () => void;
  onTimeout?: () => void;
}

export const useSessionTimeout = ({
  timeoutMinutes = 30,
  warningMinutes = 5,
  onWarning,
  onTimeout,
}: UseSessionTimeoutOptions = {}) => {
  const { isAuthenticated, logout } = useAuth();
  const timeoutRef = useRef<number | undefined>(undefined);
  const warningRef = useRef<number | undefined>(undefined);
  const lastActivityRef = useRef<number>(Date.now());

  const resetTimer = useCallback(() => {
    if (!isAuthenticated) return;

    lastActivityRef.current = Date.now();

    // Clear existing timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
    }

    // Set warning timer
    const warningTime = (timeoutMinutes - warningMinutes) * 60 * 1000;
    warningRef.current = setTimeout(() => {
      onWarning?.();
    }, warningTime);

    // Set timeout timer
    const timeoutTime = timeoutMinutes * 60 * 1000;
    timeoutRef.current = setTimeout(() => {
      onTimeout?.();
      logout();
    }, timeoutTime);
  }, [isAuthenticated, timeoutMinutes, warningMinutes, onWarning, onTimeout, logout]);

  const extendSession = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  const getRemainingTime = useCallback(() => {
    if (!isAuthenticated) return 0;
    
    const elapsed = Date.now() - lastActivityRef.current;
    const remaining = (timeoutMinutes * 60 * 1000) - elapsed;
    return Math.max(0, remaining);
  }, [isAuthenticated, timeoutMinutes]);

  useEffect(() => {
    if (!isAuthenticated) {
      // Clear timers when not authenticated
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningRef.current) {
        clearTimeout(warningRef.current);
      }
      return;
    }

    // Start the timer
    resetTimer();

    // Activity event listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      resetTimer();
    };

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningRef.current) {
        clearTimeout(warningRef.current);
      }
    };
  }, [isAuthenticated, resetTimer]);

  return {
    extendSession,
    getRemainingTime,
  };
};