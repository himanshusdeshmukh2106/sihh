/**
 * CameraView Component
 * Basic camera component with proper lifecycle management for pushup assessment
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { CameraView as ExpoCameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { ErrorHandlingService } from '../services/ErrorHandlingService';

interface CameraViewProps {
  onCameraReady?: () => void;
  onCameraError?: (error: string) => void;
  isActive: boolean;
  cameraType?: CameraType;
}

export const CameraView: React.FC<CameraViewProps> = ({
  onCameraReady,
  onCameraError,
  isActive,
  cameraType = 'front'
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<ExpoCameraView>(null);

  useEffect(() => {
    if (!permission) {
      // Still loading permissions
      return;
    }

    if (!permission.granted) {
      // Request camera permission
      requestCameraPermission();
    } else if (isActive && onCameraReady) {
      onCameraReady();
    }
  }, [permission, isActive]);

  const requestCameraPermission = async () => {
    try {
      const result = await requestPermission();
      if (!result.granted) {
        ErrorHandlingService.handleCameraPermissionError(
          new Error('Camera permission denied'),
          {
            fallbackAction: () => onCameraError?.('Camera permission denied')
          }
        );
      }
    } catch (error) {
      ErrorHandlingService.handleCameraPermissionError(
        error as Error,
        {
          fallbackAction: () => onCameraError?.('Failed to request camera permission')
        }
      );
    }
  };

  const handleCameraReady = () => {
    console.log('Camera is ready');
    onCameraReady?.();
  };

  const handleCameraError = (error: any) => {
    ErrorHandlingService.handleCameraInitializationError(
      error,
      {
        fallbackAction: () => onCameraError?.('Camera initialization failed')
      }
    );
  };

  if (!permission) {
    // Still loading permissions
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    // No permission granted
    return <View style={styles.container} />;
  }

  if (!isActive) {
    // Camera not active
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <ExpoCameraView
        ref={cameraRef}
        style={styles.camera}
        facing={cameraType}
        onCameraReady={handleCameraReady}
        // onMountError={handleCameraError}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
});