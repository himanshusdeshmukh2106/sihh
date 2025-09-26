/**
 * ErrorBoundary - React error boundary for catching and handling component errors
 */

import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ErrorHandlingService } from '../services/ErrorHandlingService';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: any) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log error using our error handling service
    const handler = ErrorHandlingService.createErrorBoundaryHandler('ErrorBoundary');
    handler(error, errorInfo);

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <View style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
            <Text style={styles.errorMessage}>
              The app encountered an unexpected error. You can try again or restart the app.
            </Text>
            
            {__DEV__ && this.state.error && (
              <View style={styles.debugContainer}>
                <Text style={styles.debugTitle}>Debug Info:</Text>
                <Text style={styles.debugText}>{this.state.error.message}</Text>
              </View>
            )}
            
            <TouchableOpacity style={styles.retryButton} onPress={this.handleRetry}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  errorContainer: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    maxWidth: 350,
  },
  
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E74C3C',
    marginBottom: 16,
    textAlign: 'center',
  },
  
  errorMessage: {
    fontSize: 16,
    color: '#2C3E50',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  
  debugContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    width: '100%',
  },
  
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6C757D',
    marginBottom: 8,
  },
  
  debugText: {
    fontSize: 12,
    color: '#6C757D',
    fontFamily: 'monospace',
  },
  
  retryButton: {
    backgroundColor: '#3498DB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});