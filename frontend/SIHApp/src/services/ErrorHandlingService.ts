/**
 * ErrorHandlingService - Centralized error handling and fallback mechanisms
 */

import { Alert } from 'react-native';

export enum ErrorType {
  CAMERA_PERMISSION = 'CAMERA_PERMISSION',
  CAMERA_INITIALIZATION = 'CAMERA_INITIALIZATION',
  DETECTION_ENGINE = 'DETECTION_ENGINE',
  DATA_STORAGE = 'DATA_STORAGE',
  PERFORMANCE = 'PERFORMANCE',
  NETWORK = 'NETWORK',
  UNKNOWN = 'UNKNOWN'
}

export interface ErrorInfo {
  type: ErrorType;
  message: string;
  originalError?: Error;
  context?: string;
  timestamp: Date;
}

export interface FallbackOptions {
  showAlert?: boolean;
  enableRetry?: boolean;
  fallbackAction?: () => void;
  customMessage?: string;
}

export class ErrorHandlingService {
  private static errorLog: ErrorInfo[] = [];
  private static maxLogSize = 100;

  /**
   * Handle camera permission errors
   */
  static handleCameraPermissionError(
    originalError?: Error,
    options: FallbackOptions = {}
  ): void {
    const errorInfo: ErrorInfo = {
      type: ErrorType.CAMERA_PERMISSION,
      message: 'Camera permission denied or not available',
      originalError,
      context: 'Camera initialization',
      timestamp: new Date()
    };

    this.logError(errorInfo);

    if (options.showAlert !== false) {
      Alert.alert(
        'Camera Permission Required',
        options.customMessage || 
        'This app needs camera access to perform pushup detection. Please enable camera permissions in your device settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open Settings',
            onPress: () => {
              // In a real app, this would open device settings
              console.log('Opening device settings...');
              options.fallbackAction?.();
            }
          },
          ...(options.enableRetry ? [{
            text: 'Retry',
            onPress: options.fallbackAction
          }] : [])
        ]
      );
    }
  }

  /**
   * Handle camera initialization errors
   */
  static handleCameraInitializationError(
    originalError?: Error,
    options: FallbackOptions = {}
  ): void {
    const errorInfo: ErrorInfo = {
      type: ErrorType.CAMERA_INITIALIZATION,
      message: 'Failed to initialize camera',
      originalError,
      context: 'Camera setup',
      timestamp: new Date()
    };

    this.logError(errorInfo);

    if (options.showAlert !== false) {
      Alert.alert(
        'Camera Error',
        options.customMessage || 
        'Unable to access the camera. Please check if another app is using it or restart the app.',
        [
          { text: 'Cancel', style: 'cancel' },
          ...(options.enableRetry ? [{
            text: 'Retry',
            onPress: options.fallbackAction
          }] : []),
          {
            text: 'Use Manual Mode',
            onPress: () => {
              console.log('Switching to manual counting mode...');
              options.fallbackAction?.();
            }
          }
        ]
      );
    }
  }

  /**
   * Handle detection engine errors
   */
  static handleDetectionEngineError(
    originalError?: Error,
    options: FallbackOptions = {}
  ): void {
    const errorInfo: ErrorInfo = {
      type: ErrorType.DETECTION_ENGINE,
      message: 'Pushup detection engine error',
      originalError,
      context: 'Detection processing',
      timestamp: new Date()
    };

    this.logError(errorInfo);

    if (options.showAlert !== false) {
      Alert.alert(
        'Detection Error',
        options.customMessage || 
        'The pushup detection system encountered an error. You can continue with manual counting.',
        [
          { text: 'Continue Manually', onPress: options.fallbackAction },
          ...(options.enableRetry ? [{
            text: 'Retry Detection',
            onPress: options.fallbackAction
          }] : [])
        ]
      );
    }
  }

  /**
   * Handle data storage errors
   */
  static handleDataStorageError(
    originalError?: Error,
    options: FallbackOptions = {}
  ): void {
    const errorInfo: ErrorInfo = {
      type: ErrorType.DATA_STORAGE,
      message: 'Failed to save or retrieve data',
      originalError,
      context: 'Data persistence',
      timestamp: new Date()
    };

    this.logError(errorInfo);

    if (options.showAlert !== false) {
      Alert.alert(
        'Storage Error',
        options.customMessage || 
        'Unable to save your assessment data. Your progress may not be saved.',
        [
          { text: 'Continue Anyway', onPress: options.fallbackAction },
          ...(options.enableRetry ? [{
            text: 'Retry Save',
            onPress: options.fallbackAction
          }] : [])
        ]
      );
    }
  }

  /**
   * Handle performance issues
   */
  static handlePerformanceError(
    originalError?: Error,
    options: FallbackOptions = {}
  ): void {
    const errorInfo: ErrorInfo = {
      type: ErrorType.PERFORMANCE,
      message: 'Performance degradation detected',
      originalError,
      context: 'Real-time processing',
      timestamp: new Date()
    };

    this.logError(errorInfo);

    if (options.showAlert !== false) {
      Alert.alert(
        'Performance Warning',
        options.customMessage || 
        'The app is running slowly. Consider closing other apps or reducing detection quality.',
        [
          { text: 'Continue', onPress: options.fallbackAction },
          {
            text: 'Reduce Quality',
            onPress: () => {
              console.log('Reducing detection quality...');
              options.fallbackAction?.();
            }
          }
        ]
      );
    }
  }

  /**
   * Handle network errors
   */
  static handleNetworkError(
    originalError?: Error,
    options: FallbackOptions = {}
  ): void {
    const errorInfo: ErrorInfo = {
      type: ErrorType.NETWORK,
      message: 'Network connection error',
      originalError,
      context: 'Data synchronization',
      timestamp: new Date()
    };

    this.logError(errorInfo);

    if (options.showAlert !== false) {
      Alert.alert(
        'Connection Error',
        options.customMessage || 
        'Unable to sync your data. Your progress will be saved locally.',
        [
          { text: 'OK', onPress: options.fallbackAction },
          ...(options.enableRetry ? [{
            text: 'Retry',
            onPress: options.fallbackAction
          }] : [])
        ]
      );
    }
  }

  /**
   * Handle unknown errors
   */
  static handleUnknownError(
    originalError?: Error,
    options: FallbackOptions = {}
  ): void {
    const errorInfo: ErrorInfo = {
      type: ErrorType.UNKNOWN,
      message: 'An unexpected error occurred',
      originalError,
      context: 'Unknown',
      timestamp: new Date()
    };

    this.logError(errorInfo);

    if (options.showAlert !== false) {
      Alert.alert(
        'Unexpected Error',
        options.customMessage || 
        'Something went wrong. Please try again or restart the app.',
        [
          { text: 'OK', onPress: options.fallbackAction },
          ...(options.enableRetry ? [{
            text: 'Retry',
            onPress: options.fallbackAction
          }] : [])
        ]
      );
    }
  }

  /**
   * Log error information
   */
  private static logError(errorInfo: ErrorInfo): void {
    // Add to error log
    this.errorLog.unshift(errorInfo);
    
    // Maintain log size
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize);
    }

    // Console logging for development
    console.error(`[${errorInfo.type}] ${errorInfo.message}`, {
      context: errorInfo.context,
      timestamp: errorInfo.timestamp,
      originalError: errorInfo.originalError
    });
  }

  /**
   * Get error log for debugging
   */
  static getErrorLog(): ErrorInfo[] {
    return [...this.errorLog];
  }

  /**
   * Clear error log
   */
  static clearErrorLog(): void {
    this.errorLog = [];
  }

  /**
   * Check device capabilities
   */
  static async checkDeviceCapabilities(): Promise<{
    cameraAvailable: boolean;
    performanceLevel: 'high' | 'medium' | 'low';
    storageAvailable: boolean;
  }> {
    try {
      // In a real implementation, this would check actual device capabilities
      // For now, we'll simulate the checks
      
      const cameraAvailable = true; // Would check camera permissions and availability
      const storageAvailable = true; // Would check storage permissions and space
      
      // Simulate performance check based on device specs
      const performanceLevel: 'high' | 'medium' | 'low' = 'medium';
      
      return {
        cameraAvailable,
        performanceLevel,
        storageAvailable
      };
    } catch (error) {
      console.error('Failed to check device capabilities:', error);
      return {
        cameraAvailable: false,
        performanceLevel: 'low',
        storageAvailable: false
      };
    }
  }

  /**
   * Monitor performance and trigger warnings
   */
  static monitorPerformance(fps: number, memoryUsage?: number): void {
    const lowFpsThreshold = 15;
    const highMemoryThreshold = 100; // MB
    
    if (fps < lowFpsThreshold) {
      this.handlePerformanceError(
        new Error(`Low FPS detected: ${fps}`),
        {
          showAlert: false, // Don't show alert for every frame
          customMessage: `Frame rate is low (${fps} FPS). Consider reducing quality.`
        }
      );
    }
    
    if (memoryUsage && memoryUsage > highMemoryThreshold) {
      this.handlePerformanceError(
        new Error(`High memory usage: ${memoryUsage}MB`),
        {
          showAlert: false,
          customMessage: `High memory usage detected (${memoryUsage}MB).`
        }
      );
    }
  }

  /**
   * Create error boundary handler
   */
  static createErrorBoundaryHandler(context: string) {
    return (error: Error, errorInfo: any) => {
      const errorDetails: ErrorInfo = {
        type: ErrorType.UNKNOWN,
        message: error.message,
        originalError: error,
        context,
        timestamp: new Date()
      };
      
      this.logError(errorDetails);
      
      // In production, you might want to send this to a crash reporting service
      console.error('Error Boundary caught an error:', error, errorInfo);
    };
  }

  /**
   * Graceful degradation for detection failures
   */
  static enableFallbackMode(): {
    useManualCounting: boolean;
    reducedQuality: boolean;
    offlineMode: boolean;
  } {
    console.log('Enabling fallback mode due to errors');
    
    return {
      useManualCounting: true,
      reducedQuality: true,
      offlineMode: true
    };
  }
}