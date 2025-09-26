/**
 * MockPoseDetection - Simulates pose detection for testing pushup detection
 * In production, this would be replaced with actual MediaPipe or TensorFlow.js pose detection
 */

import { Keypoint } from '../types';

export class MockPoseDetection {
  private isRunning = false;
  private frameCount = 0;
  private pushupCycle = 0; // 0-100, simulates pushup motion
  private cycleDirection = 1; // 1 for down, -1 for up
  private lastPushupTime = 0;
  private pushupCount = 0;

  /**
   * Start mock pose detection
   */
  start(): void {
    this.isRunning = true;
    this.frameCount = 0;
    this.pushupCount = 0;
    this.lastPushupTime = Date.now();
    console.log('Mock pose detection started');
  }

  /**
   * Stop mock pose detection
   */
  stop(): void {
    this.isRunning = false;
    console.log('Mock pose detection stopped');
  }

  /**
   * Generate mock keypoints that simulate a person doing pushups
   */
  generateMockKeypoints(): Keypoint[] {
    if (!this.isRunning) {
      return [];
    }

    this.frameCount++;
    
    // Check if 2 seconds have passed for pushup increment
    const currentTime = Date.now();
    if (currentTime - this.lastPushupTime >= 2000) { // 2 seconds
      this.pushupCount++;
      this.lastPushupTime = currentTime;
    }
    
    // Simulate pushup motion cycle (0-100-0) - faster for visual effect
    this.pushupCycle += this.cycleDirection * 3;
    
    if (this.pushupCycle >= 100) {
      this.cycleDirection = -1;
      this.pushupCycle = 100;
    } else if (this.pushupCycle <= 0) {
      this.cycleDirection = 1;
      this.pushupCycle = 0;
    }

    // Calculate simulated body positions with focus on angle changes
    const progress = this.pushupCycle / 100;
    
    // Base positions (normalized coordinates 0-1) - keep body stable
    const baseY = 0.5;
    const shoulderWidth = 0.15;
    const armLength = 0.12;
    
    // Focus on elbow angle changes for pushup simulation
    // At progress=0 (up): elbow angle ~180° (arms extended)
    // At progress=1 (down): elbow angle ~90° (arms bent)
    const elbowAngle = Math.PI - (progress * Math.PI/2); // 180° to 90°
    const elbowBendX = Math.cos(elbowAngle) * armLength * 0.6;
    const elbowBendY = Math.sin(elbowAngle) * armLength * 0.3;
    
    // Generate complete body keypoints for full skeleton
    const keypoints: Keypoint[] = [
      // Head keypoints
      {
        x: 0.5,
        y: baseY - 0.15,
        confidence: 0.9,
        name: 'nose'
      },
      {
        x: 0.5 - 0.02,
        y: baseY - 0.16,
        confidence: 0.85,
        name: 'left_eye'
      },
      {
        x: 0.5 + 0.02,
        y: baseY - 0.16,
        confidence: 0.85,
        name: 'right_eye'
      },
      {
        x: 0.5 - 0.04,
        y: baseY - 0.15,
        confidence: 0.8,
        name: 'left_ear'
      },
      {
        x: 0.5 + 0.04,
        y: baseY - 0.15,
        confidence: 0.8,
        name: 'right_ear'
      },
      
      // Shoulder keypoints
      {
        x: 0.5 - shoulderWidth,
        y: baseY,
        confidence: 0.95,
        name: 'left_shoulder'
      },
      {
        x: 0.5 + shoulderWidth,
        y: baseY,
        confidence: 0.95,
        name: 'right_shoulder'
      },
      
      // Arm keypoints with realistic angle-based pushup motion
      {
        x: 0.5 - shoulderWidth + elbowBendX,
        y: baseY + elbowBendY,
        confidence: 0.9,
        name: 'left_elbow'
      },
      {
        x: 0.5 + shoulderWidth - elbowBendX,
        y: baseY + elbowBendY,
        confidence: 0.9,
        name: 'right_elbow'
      },
      {
        x: 0.5 - shoulderWidth + elbowBendX * 1.5,
        y: baseY + elbowBendY * 1.2,
        confidence: 0.85,
        name: 'left_wrist'
      },
      {
        x: 0.5 + shoulderWidth - elbowBendX * 1.5,
        y: baseY + elbowBendY * 1.2,
        confidence: 0.85,
        name: 'right_wrist'
      },
      
      // Hip keypoints
      {
        x: 0.5 - shoulderWidth * 0.8,
        y: baseY + 0.25,
        confidence: 0.9,
        name: 'left_hip'
      },
      {
        x: 0.5 + shoulderWidth * 0.8,
        y: baseY + 0.25,
        confidence: 0.9,
        name: 'right_hip'
      },
      
      // Leg keypoints
      {
        x: 0.5 - shoulderWidth * 0.8,
        y: baseY + 0.45,
        confidence: 0.85,
        name: 'left_knee'
      },
      {
        x: 0.5 + shoulderWidth * 0.8,
        y: baseY + 0.45,
        confidence: 0.85,
        name: 'right_knee'
      },
      {
        x: 0.5 - shoulderWidth * 0.8,
        y: baseY + 0.65,
        confidence: 0.8,
        name: 'left_ankle'
      },
      {
        x: 0.5 + shoulderWidth * 0.8,
        y: baseY + 0.65,
        confidence: 0.8,
        name: 'right_ankle'
      }
    ];

    // Convert normalized coordinates to pixel coordinates (assuming 640x480 frame)
    const frameWidth = 640;
    const frameHeight = 480;
    
    return keypoints.map(kp => ({
      ...kp,
      x: kp.x * frameWidth,
      y: kp.y * frameHeight
    }));
  }

  /**
   * Get current cycle information for debugging
   */
  getCycleInfo() {
    return {
      frameCount: this.frameCount,
      pushupCycle: this.pushupCycle,
      cycleDirection: this.cycleDirection,
      isRunning: this.isRunning,
      pushupCount: this.pushupCount
    };
  }

  /**
   * Get current pushup count
   */
  getPushupCount(): number {
    return this.pushupCount;
  }

  /**
   * Simulate detection confidence issues
   */
  simulateLowConfidence(): Keypoint[] {
    const keypoints = this.generateMockKeypoints();
    return keypoints.map(kp => ({
      ...kp,
      confidence: Math.random() * 0.4 // Low confidence
    }));
  }

  /**
   * Simulate person not in frame
   */
  simulateNoDetection(): Keypoint[] {
    return [];
  }

  /**
   * Simulate asymmetric movement (poor form)
   */
  simulateAsymmetricMovement(): Keypoint[] {
    const keypoints = this.generateMockKeypoints();
    
    // Make left arm move differently than right arm
    return keypoints.map(kp => {
      if (kp.name.includes('left')) {
        return {
          ...kp,
          y: kp.y + Math.sin(this.frameCount * 0.1) * 10 // Add some variation
        };
      }
      return kp;
    });
  }
}