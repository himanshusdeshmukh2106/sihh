/**
 * PushupDetectionEngine - Core computer vision logic for pushup detection
 * Adapted from SIH-Exercises repository for React Native
 */

import { Keypoint, PushupDetectionState, AssessmentConfiguration } from '../types';
import { ErrorHandlingService } from './ErrorHandlingService';

// Configuration constants based on SIH-Exercises analysis
const PUSHUP_CONFIG = {
  DOWN_ANGLE_THRESHOLD: 140,
  UP_ANGLE_THRESHOLD: 170,
  HOLD_TIME: 300, // milliseconds
  MIN_VISIBILITY: 0.5,
  CALORIES_PER_PUSHUP: 0.32,
  SYMMETRY_THRESHOLD: 15, // degrees
  MIN_DETECTION_CONFIDENCE: 0.7,
};

interface PushupMetrics {
  angle: number;
  formScore: number;
  state: 'up' | 'down';
  visibility: number;
  symmetry: number;
  feedback: string[];
}

export class PushupDetectionEngine {
  private state: PushupDetectionState;
  private config: AssessmentConfiguration;
  private lastTransitionTime: number;
  private formScores: number[];
  private onPushupDetectedCallback?: (count: number, metrics: PushupMetrics) => void;

  constructor(config?: Partial<AssessmentConfiguration>) {
    this.config = {
      detectionThreshold: PUSHUP_CONFIG.MIN_DETECTION_CONFIDENCE,
      minimumPushupDuration: PUSHUP_CONFIG.HOLD_TIME,
      maxSessionDuration: 300000, // 5 minutes
      requiredKeypoints: ['left_shoulder', 'left_elbow', 'left_wrist', 'right_shoulder', 'right_elbow', 'right_wrist'],
      formValidationEnabled: true,
      ...config
    };

    this.state = {
      isInitialized: false,
      isDetecting: false,
      currentCount: 0,
      sessionStartTime: null,
      lastDetectionTime: null,
      detectionConfidence: 0,
      bodyKeypoints: []
    };

    this.lastTransitionTime = Date.now();
    this.formScores = [];
  }

  /**
   * Initialize the detection engine
   */
  async initialize(): Promise<boolean> {
    try {
      // In a real implementation, this would initialize MediaPipe or similar pose detection
      // For now, we're using a mock detection system for demonstration
      console.log('Initializing PushupDetectionEngine...');
      
      // Simulate initialization delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.state.isInitialized = true;
      console.log('PushupDetectionEngine initialized successfully');
      return true;
    } catch (error) {
      ErrorHandlingService.handleDetectionEngineError(
        error as Error,
        {
          showAlert: false // Let the calling component handle the UI
        }
      );
      return false;
    }
  }

  /**
   * Start pushup detection
   */
  startDetection(onPushupDetected: (count: number, metrics: PushupMetrics) => void): void {
    if (!this.state.isInitialized) {
      throw new Error('Detection engine not initialized');
    }

    this.state.isDetecting = true;
    this.state.sessionStartTime = new Date();
    this.state.currentCount = 0;
    this.onPushupDetectedCallback = onPushupDetected;
    this.lastTransitionTime = Date.now();
    
    console.log('Pushup detection started');
  }

  /**
   * Pause detection
   */
  pauseDetection(): void {
    this.state.isDetecting = false;
    console.log('Pushup detection paused');
  }

  /**
   * Stop detection
   */
  stopDetection(): void {
    this.state.isDetecting = false;
    this.state.sessionStartTime = null;
    this.onPushupDetectedCallback = undefined;
    console.log('Pushup detection stopped');
  }

  /**
   * Get current pushup count
   */
  getCurrentCount(): number {
    return this.state.currentCount;
  }

  /**
   * Check if detection is active
   */
  isDetectionActive(): boolean {
    return this.state.isDetecting;
  }

  /**
   * Calculate angle between three points
   * Adapted from SIH-Exercises repository
   */
  private calculateAngle(a: [number, number], b: [number, number], c: [number, number]): number {
    try {
      const ba = [a[0] - b[0], a[1] - b[1]];
      const bc = [c[0] - b[0], c[1] - b[1]];
      
      const normBa = Math.sqrt(ba[0] * ba[0] + ba[1] * ba[1]);
      const normBc = Math.sqrt(bc[0] * bc[0] + bc[1] * bc[1]);
      
      if (normBa < 1e-7 || normBc < 1e-7) {
        return 180.0;
      }
      
      const cosineAngle = (ba[0] * bc[0] + ba[1] * bc[1]) / (normBa * normBc);
      const clampedCosine = Math.max(-1.0, Math.min(1.0, cosineAngle));
      const angle = Math.acos(clampedCosine);
      
      return (angle * 180) / Math.PI;
    } catch (error) {
      console.warn('Error calculating angle:', error);
      return 180.0;
    }
  }

  /**
   * Calculate form score based on current pose
   */
  private calculateFormScore(leftAngle: number, rightAngle: number, currentState: 'up' | 'down'): number {
    try {
      const avgAngle = (leftAngle + rightAngle) / 2;
      let formScore = 0;

      if (currentState === 'down') {
        // Ideal down position is around 90 degrees
        formScore = Math.max(0, 100 - Math.abs(avgAngle - 90) * 2);
      } else {
        // Ideal up position is around 180 degrees
        formScore = Math.max(0, 100 - Math.abs(avgAngle - 180) * 1);
      }

      return Math.min(100, formScore);
    } catch (error) {
      console.warn('Error calculating form score:', error);
      return 0;
    }
  }

  /**
   * Generate feedback based on current pose analysis
   */
  private generateFeedback(leftAngle: number, rightAngle: number, symmetry: number, visibility: number): string[] {
    const feedback: string[] = [];

    // Visibility check
    if (visibility < PUSHUP_CONFIG.MIN_VISIBILITY) {
      feedback.push('Position yourself clearly in frame');
      return feedback;
    }

    // Symmetry check
    if (symmetry > PUSHUP_CONFIG.SYMMETRY_THRESHOLD) {
      feedback.push('Keep both arms moving equally');
    }

    // Form guidance
    const avgAngle = (leftAngle + rightAngle) / 2;
    if (avgAngle > 175) {
      feedback.push('Try bending your arms more');
    } else if (avgAngle < 90 && avgAngle > 0) {
      feedback.push('Go lower for full pushup');
    }

    // Extension check
    if (avgAngle < PUSHUP_CONFIG.UP_ANGLE_THRESHOLD) {
      feedback.push('Extend arms fully at the top');
    }

    if (feedback.length === 0) {
      feedback.push('Great form! Keep it up!');
    }

    return feedback;
  }

  /**
   * Process pose keypoints and detect pushups
   * This would be called with real pose detection data in production
   */
  processFrame(keypoints: Keypoint[], mockPushupCount?: number): PushupMetrics | null {
    if (!this.state.isDetecting || keypoints.length === 0) {
      return null;
    }

    try {
      // For mock implementation, use the provided pushup count
      if (mockPushupCount !== undefined && mockPushupCount > this.state.currentCount) {
        this.state.currentCount = mockPushupCount;
        this.state.lastDetectionTime = new Date();
        
        // Trigger callback for new pushup
        if (this.onPushupDetectedCallback) {
          const mockMetrics: PushupMetrics = {
            angle: 150,
            formScore: 85,
            state: 'up',
            visibility: 0.9,
            symmetry: 5,
            feedback: ['Great form! Keep it up!']
          };
          this.onPushupDetectedCallback(this.state.currentCount, mockMetrics);
        }
      }

      // Extract key body parts for pushup analysis
      const leftShoulder = this.findKeypoint(keypoints, 'left_shoulder');
      const leftElbow = this.findKeypoint(keypoints, 'left_elbow');
      const leftWrist = this.findKeypoint(keypoints, 'left_wrist');
      const rightShoulder = this.findKeypoint(keypoints, 'right_shoulder');
      const rightElbow = this.findKeypoint(keypoints, 'right_elbow');
      const rightWrist = this.findKeypoint(keypoints, 'right_wrist');

      if (!leftShoulder || !leftElbow || !leftWrist || !rightShoulder || !rightElbow || !rightWrist) {
        return {
          angle: 0,
          formScore: 0,
          state: 'up',
          visibility: 0,
          symmetry: 0,
          feedback: ['Position yourself clearly in frame']
        };
      }

      // Calculate elbow angles
      const leftAngle = this.calculateAngle(
        [leftShoulder.x, leftShoulder.y],
        [leftElbow.x, leftElbow.y],
        [leftWrist.x, leftWrist.y]
      );

      const rightAngle = this.calculateAngle(
        [rightShoulder.x, rightShoulder.y],
        [rightElbow.x, rightElbow.y],
        [rightWrist.x, rightWrist.y]
      );

      const avgAngle = (leftAngle + rightAngle) / 2;
      const symmetry = Math.abs(leftAngle - rightAngle);
      const visibility = Math.min(leftElbow.confidence, rightElbow.confidence);

      // Update state
      this.state.bodyKeypoints = keypoints;
      this.state.detectionConfidence = visibility;

      // Calculate metrics
      const formScore = this.calculateFormScore(leftAngle, rightAngle, 'up');
      const feedback = this.generateFeedback(leftAngle, rightAngle, symmetry, visibility);

      const metrics: PushupMetrics = {
        angle: avgAngle,
        formScore,
        state: 'up',
        visibility,
        symmetry,
        feedback
      };

      return metrics;

    } catch (error) {
      ErrorHandlingService.handleDetectionEngineError(
        error as Error,
        {
          showAlert: false,
          customMessage: 'Error processing camera frame'
        }
      );
      return null;
    }
  }

  /**
   * Find a specific keypoint by name
   */
  private findKeypoint(keypoints: Keypoint[], name: string): Keypoint | null {
    return keypoints.find(kp => kp.name === name) || null;
  }

  /**
   * Get current state from stored keypoints
   */
  private getCurrentState(): 'up' | 'down' | null {
    if (this.state.bodyKeypoints.length === 0) return null;
    
    // This is a simplified state determination
    // In practice, you'd analyze the stored keypoints
    return 'up'; // Default state
  }

  /**
   * Get session statistics
   */
  getSessionStats() {
    const avgFormScore = this.formScores.length > 0 ? 
      this.formScores.reduce((a, b) => a + b, 0) / this.formScores.length : 0;
    
    const bestFormScore = this.formScores.length > 0 ? Math.max(...this.formScores) : 0;
    
    const sessionDuration = this.state.sessionStartTime ? 
      Date.now() - this.state.sessionStartTime.getTime() : 0;

    return {
      totalPushups: this.state.currentCount,
      avgFormScore: Math.round(avgFormScore),
      bestFormScore: Math.round(bestFormScore),
      sessionDuration: Math.round(sessionDuration / 1000), // in seconds
      caloriesBurned: Math.round(this.state.currentCount * PUSHUP_CONFIG.CALORIES_PER_PUSHUP * 100) / 100
    };
  }

  /**
   * Reset the detection engine
   */
  reset(): void {
    this.state.currentCount = 0;
    this.state.lastDetectionTime = null;
    this.state.bodyKeypoints = [];
    this.formScores = [];
    this.lastTransitionTime = Date.now();
    console.log('PushupDetectionEngine reset');
  }
}