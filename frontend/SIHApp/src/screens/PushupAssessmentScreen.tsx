/**
 * PushupAssessmentScreen - Main pushup assessment interface
 * Full-screen camera view with real-time detection and UI overlay
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
  Dimensions,
  Animated,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, DetectionFeedback } from '../types';
import { CameraView } from '../components/CameraView';
import { PoseOverlay } from '../components/PoseOverlay';
import { PushupDetectionEngine } from '../services/PushupDetectionEngine';
import { MockPoseDetection } from '../services/MockPoseDetection';
import { useUser } from '../hooks/useUser';
import { ErrorHandlingService } from '../services/ErrorHandlingService';
import { Keypoint } from '../types';
import { theme } from '../styles/theme';

type PushupAssessmentNavigationProp = StackNavigationProp<RootStackParamList, 'PushupAssessment'>;
type PushupAssessmentRouteProp = RouteProp<RootStackParamList, 'PushupAssessment'>;

const { width, height } = Dimensions.get('window');

export const PushupAssessmentScreen: React.FC = () => {
  const navigation = useNavigation<PushupAssessmentNavigationProp>();
  const route = useRoute<PushupAssessmentRouteProp>();
  const { sportId, sportName, experienceLevel, highestLevel } = route.params;
  const { getCurrentUserId } = useUser();

  // Assessment state
  const [isAssessmentActive, setIsAssessmentActive] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [pushupCount, setPushupCount] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [detectionFeedback, setDetectionFeedback] = useState<DetectionFeedback>('not_detected');
  const [formScore, setFormScore] = useState(0);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [feedbackMessages, setFeedbackMessages] = useState<string[]>([]);
  const [currentKeypoints, setCurrentKeypoints] = useState<Keypoint[]>([]);
  const [sessionDuration, setSessionDuration] = useState(0);

  // Camera and detection state
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraType, setCameraType] = useState<'front' | 'back'>('front');

  // Detection engine and mock pose detection
  const detectionEngineRef = useRef<PushupDetectionEngine | null>(null);
  const mockPoseDetectionRef = useRef<MockPoseDetection | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const feedbackOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Set up screen for assessment
    StatusBar.setHidden(true);
    
    // Initialize detection engine
    initializeDetectionEngine();
    
    return () => {
      StatusBar.setHidden(false);
      cleanup();
    };
  }, []);

  // Pulse animation for counter
  useEffect(() => {
    if (isAssessmentActive) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [isAssessmentActive]);

  // Feedback animation
  useEffect(() => {
    Animated.timing(feedbackOpacity, {
      toValue: feedbackMessages.length > 0 ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [feedbackMessages]);

  // Session timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAssessmentActive && sessionStartTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000);
        setSessionDuration(elapsed);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAssessmentActive, sessionStartTime]);

  const initializeDetectionEngine = async () => {
    try {
      // Check device capabilities first
      const capabilities = await ErrorHandlingService.checkDeviceCapabilities();
      
      if (!capabilities.cameraAvailable) {
        throw new Error('Camera not available on this device');
      }

      // Initialize detection engine
      detectionEngineRef.current = new PushupDetectionEngine();
      const initialized = await detectionEngineRef.current.initialize();
      
      if (!initialized) {
        throw new Error('Failed to initialize detection engine');
      }

      // Initialize mock pose detection for testing
      mockPoseDetectionRef.current = new MockPoseDetection();
      
      console.log('Detection systems initialized');
    } catch (error) {
      ErrorHandlingService.handleDetectionEngineError(
        error as Error,
        {
          fallbackAction: () => {
            setCameraError('Detection system unavailable. Manual counting mode enabled.');
            // Enable fallback mode
            const fallbackMode = ErrorHandlingService.enableFallbackMode();
            console.log('Fallback mode enabled:', fallbackMode);
          }
        }
      );
    }
  };

  const cleanup = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
    
    if (detectionEngineRef.current) {
      detectionEngineRef.current.stopDetection();
    }
    
    if (mockPoseDetectionRef.current) {
      mockPoseDetectionRef.current.stop();
    }
  };

  const startDetectionLoop = () => {
    if (!detectionEngineRef.current || !mockPoseDetectionRef.current) {
      console.error('Detection systems not initialized');
      return;
    }

    // Start mock pose detection
    mockPoseDetectionRef.current.start();

    // Start detection loop (simulate 30 FPS)
    detectionIntervalRef.current = setInterval(() => {
      if (!detectionEngineRef.current || !mockPoseDetectionRef.current) {
        return;
      }

      try {
        // Get mock keypoints (in production, this would come from camera frames)
        const keypoints = mockPoseDetectionRef.current.generateMockKeypoints();
        setCurrentKeypoints(keypoints);
        
        // Only process detection if assessment is active
        if (isAssessmentActive) {
          // Get mock pushup count (increments every 2 seconds)
          const mockPushupCount = mockPoseDetectionRef.current.getPushupCount();
          
          // Process frame with detection engine
          const metrics = detectionEngineRef.current.processFrame(keypoints, mockPushupCount);
          
          if (metrics) {
            // Monitor performance
            ErrorHandlingService.monitorPerformance(30); // Assume 30 FPS for mock
            
            // Update UI with detection results
            setCurrentAngle(Math.round(metrics.angle));
            setFormScore(Math.round(metrics.formScore));
            setFeedbackMessages(metrics.feedback);
            
            // Update detection feedback based on metrics
            if (metrics.visibility < 0.5) {
              setDetectionFeedback('not_detected');
            } else if (metrics.formScore > 70) {
              setDetectionFeedback('good');
            } else {
              setDetectionFeedback('adjust_position');
            }
          }
        }

      } catch (error) {
        ErrorHandlingService.handleDetectionEngineError(
          error as Error,
          {
            showAlert: false,
            customMessage: 'Detection processing error'
          }
        );
        
        // Continue with reduced functionality
        setDetectionFeedback('not_detected');
        setFeedbackMessages(['Detection temporarily unavailable']);
      }
    }, 33); // ~30 FPS
  };

  const stopDetectionLoop = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    
    if (mockPoseDetectionRef.current) {
      mockPoseDetectionRef.current.stop();
    }
  };

  const handleCameraReady = () => {
    console.log('Camera ready for pushup assessment');
    setIsCameraReady(true);
    setCameraError(null);
    
    // Start the detection loop for skeleton overlay (even when not assessing)
    if (detectionEngineRef.current && mockPoseDetectionRef.current) {
      startDetectionLoop();
    }
  };

  const handleCameraError = (error: string) => {
    console.error('Camera error:', error);
    setCameraError(error);
    setIsCameraReady(false);
  };

  const handleCameraSwitch = () => {
    if (isAssessmentActive) {
      // Don't allow camera switching during active assessment
      return;
    }
    setCameraType(prev => prev === 'front' ? 'back' : 'front');
  };

  const handleStartAssessment = () => {
    if (!isCameraReady || !detectionEngineRef.current) {
      Alert.alert('System Not Ready', 'Please wait for the camera and detection system to initialize.');
      return;
    }

    setIsAssessmentActive(true);
    setSessionStartTime(new Date());
    setPushupCount(0);
    setFormScore(0);
    setCurrentAngle(0);
    setDetectionFeedback('adjust_position');
    setFeedbackMessages(['Get into pushup position']);

    // Start detection
    detectionEngineRef.current.startDetection((count, metrics) => {
      setPushupCount(count);
      
      // Trigger success animation when pushup is detected
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });

    // Detection loop is already running for skeleton display
    
    console.log('Starting pushup assessment', {
      sportId,
      sportName,
      experienceLevel,
      highestLevel
    });
  };

  const handlePauseAssessment = () => {
    setIsAssessmentActive(false);
    setDetectionFeedback('not_detected');
    setFeedbackMessages(['Assessment paused - Press Resume to continue']);
    
    if (detectionEngineRef.current) {
      detectionEngineRef.current.pauseDetection();
    }
    
    stopDetectionLoop();
    console.log('Assessment paused');
  };

  const handleResumeAssessment = () => {
    if (!detectionEngineRef.current) {
      Alert.alert('Error', 'Detection system not available');
      return;
    }

    setIsAssessmentActive(true);
    setDetectionFeedback('adjust_position');
    setFeedbackMessages(['Assessment resumed - Get into position']);

    // Resume detection
    detectionEngineRef.current.startDetection((count, metrics) => {
      setPushupCount(count);
      
      // Trigger success animation when pushup is detected
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });

    startDetectionLoop();
    console.log('Assessment resumed');
  };

  const handleStopAssessment = () => {
    const duration = sessionStartTime ? 
      Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000) : 0;

    setIsAssessmentActive(false);
    setDetectionFeedback('not_detected');
    setFeedbackMessages([]);

    // Stop detection
    if (detectionEngineRef.current) {
      detectionEngineRef.current.stopDetection();
    }
    
    stopDetectionLoop();

    // Get final statistics
    const stats = detectionEngineRef.current?.getSessionStats() || {
      totalPushups: pushupCount,
      avgFormScore: formScore,
      bestFormScore: formScore,
      sessionDuration: duration,
      caloriesBurned: pushupCount * 0.32
    };

    // Navigate to results screen
    navigation.navigate('AssessmentResults', {
      totalPushups: stats.totalPushups,
      duration: stats.sessionDuration,
      assessmentData: {
        id: Date.now().toString(),
        userId: getCurrentUserId(),
        sportId,
        totalPushups: stats.totalPushups,
        duration: stats.sessionDuration,
        timestamp: new Date(),
        experienceLevel,
        highestLevel
      }
    });
  };

  const getStatusColor = () => {
    switch (detectionFeedback) {
      case 'good': return '#27AE60';
      case 'adjust_position': return '#F39C12';
      case 'not_detected': return '#E74C3C';
      default: return '#95A5A6';
    }
  };

  const getStatusText = () => {
    switch (detectionFeedback) {
      case 'good': return 'Perfect Position!';
      case 'adjust_position': return 'Adjust Your Position';
      case 'not_detected': return 'Position Yourself in Frame';
      default: return 'Initializing...';
    }
  };

  const renderCameraOverlay = () => (
    <View style={styles.overlay}>
      {/* Top Status Bar */}
      <View style={styles.topBar}>
        <View style={styles.statusContainer}>
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
          <Text style={styles.statusText}>{getStatusText()}</Text>
          {sessionStartTime && (
            <Text style={styles.timerText}>
              {Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, '0')}
            </Text>
          )}
        </View>
        <View style={styles.topRightControls}>
          <TouchableOpacity 
            style={[styles.cameraToggleButton, isAssessmentActive && styles.disabledButton]}
            onPress={handleCameraSwitch}
            disabled={isAssessmentActive}
          >
            <Text style={styles.cameraToggleText}>
              {cameraType === 'front' ? '📷' : '🔄'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Top Left Counter - Minimal */}
      <View style={styles.topLeftCounter}>
        <Text style={styles.counterValue}>{pushupCount}</Text>
        <Text style={styles.counterLabel}>PUSHUPS</Text>
      </View>

      {/* Real-time Feedback */}
      {isAssessmentActive && (
        <Animated.View style={[styles.feedbackContainer, { opacity: feedbackOpacity }]}>
          {feedbackMessages.map((message, index) => (
            <Text key={index} style={styles.feedbackText}>
              {message}
            </Text>
          ))}
        </Animated.View>
      )}

      {/* Camera Type Indicator */}
      {!isAssessmentActive && (
        <View style={styles.cameraIndicator}>
          <Text style={styles.cameraIndicatorText}>
            {cameraType === 'front' ? 'Front Camera' : 'Back Camera'}
          </Text>
        </View>
      )}

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        {!sessionStartTime ? (
          // Initial start button
          <TouchableOpacity
            style={[styles.controlButton, styles.startButton]}
            onPress={handleStartAssessment}
            disabled={!isCameraReady || !detectionEngineRef.current}
          >
            <Text style={styles.startButtonText}>
              {isCameraReady && detectionEngineRef.current ? '🚀 Start Assessment' : 'Initializing...'}
            </Text>
          </TouchableOpacity>
        ) : !isAssessmentActive ? (
          // Paused state - show resume and stop
          <View style={styles.activeControls}>
            <TouchableOpacity
              style={[styles.controlButton, styles.resumeButton]}
              onPress={handleResumeAssessment}
            >
              <Text style={styles.controlButtonText}>▶️ Resume</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlButton, styles.stopButton]}
              onPress={handleStopAssessment}
            >
              <Text style={styles.controlButtonText}>⏹️ Finish</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Active state - show pause and stop
          <View style={styles.activeControls}>
            <TouchableOpacity
              style={[styles.controlButton, styles.pauseButton]}
              onPress={handlePauseAssessment}
            >
              <Text style={styles.controlButtonText}>⏸️ Pause</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlButton, styles.stopButton]}
              onPress={handleStopAssessment}
            >
              <Text style={styles.controlButtonText}>⏹️ Finish</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>


    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Camera Error</Text>
      <Text style={styles.errorMessage}>{cameraError}</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => {
          setCameraError(null);
          setIsCameraReady(false);
        }}
      >
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {cameraError ? (
        renderErrorState()
      ) : (
        <>
          <CameraView
            onCameraReady={handleCameraReady}
            onCameraError={handleCameraError}
            isActive={true}
            cameraType={cameraType}
          />
          {currentKeypoints.length > 0 && (
            <PoseOverlay
              keypoints={currentKeypoints}
              frameWidth={640}
              frameHeight={480}
              showSkeleton={true}
            />
          )}
          {renderCameraOverlay()}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  
  // Top Status Bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  
  statusText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },

  timerText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 12,
    fontFamily: 'monospace',
  },
  
  topRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  cameraToggleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  disabledButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    opacity: 0.5,
  },

  cameraToggleText: {
    fontSize: 18,
  },

  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  closeButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  
  // Top Left Counter
  topLeftCounter: {
    position: 'absolute',
    top: 100,
    left: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 15,
    zIndex: 15,
  },
  
  counterLabel: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  
  counterValue: {
    color: '#27AE60',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Real-time Feedback
  feedbackContainer: {
    position: 'absolute',
    top: '20%',
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 15,
    padding: 16,
    alignItems: 'center',
  },

  feedbackText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 4,
  },

  // Camera Indicator
  cameraIndicator: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },

  cameraIndicatorText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
  
  // Bottom Controls
  bottomControls: {
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  
  controlButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 8,
  },
  
  startButton: {
    backgroundColor: '#27AE60',
  },
  
  startButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  activeControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  
  pauseButton: {
    backgroundColor: '#F39C12',
    flex: 0.45,
  },

  resumeButton: {
    backgroundColor: '#27AE60',
    flex: 0.45,
  },
  
  stopButton: {
    backgroundColor: '#E74C3C',
    flex: 0.45,
  },
  
  controlButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 40,
  },
  
  errorTitle: {
    color: '#E74C3C',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  
  errorMessage: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  
  retryButton: {
    backgroundColor: '#3498DB',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    marginBottom: 16,
  },
  
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  backButton: {
    backgroundColor: '#95A5A6',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
  
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});