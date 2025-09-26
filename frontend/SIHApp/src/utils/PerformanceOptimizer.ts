/**
 * PerformanceOptimizer - Utilities for optimizing app performance
 */

export interface PerformanceMetrics {
  fps: number;
  frameProcessingTime: number;
  memoryUsage: number;
  detectionLatency: number;
}

export interface OptimizationSettings {
  targetFPS: number;
  maxFrameProcessingTime: number;
  enableFrameSkipping: boolean;
  detectionQuality: 'high' | 'medium' | 'low';
  batchSize: number;
}

export class PerformanceOptimizer {
  private metrics: PerformanceMetrics = {
    fps: 0,
    frameProcessingTime: 0,
    memoryUsage: 0,
    detectionLatency: 0
  };

  private settings: OptimizationSettings = {
    targetFPS: 30,
    maxFrameProcessingTime: 33, // ~30 FPS
    enableFrameSkipping: true,
    detectionQuality: 'medium',
    batchSize: 1
  };

  private frameCount = 0;
  private lastFrameTime = 0;
  private frameTimeHistory: number[] = [];
  private readonly maxHistorySize = 30;

  /**
   * Update performance metrics
   */
  updateMetrics(newMetrics: Partial<PerformanceMetrics>): void {
    this.metrics = { ...this.metrics, ...newMetrics };
    
    // Update frame time history
    if (newMetrics.frameProcessingTime !== undefined) {
      this.frameTimeHistory.push(newMetrics.frameProcessingTime);
      if (this.frameTimeHistory.length > this.maxHistorySize) {
        this.frameTimeHistory.shift();
      }
    }
  }

  /**
   * Calculate current FPS
   */
  calculateFPS(): number {
    const currentTime = Date.now();
    
    if (this.lastFrameTime === 0) {
      this.lastFrameTime = currentTime;
      return 0;
    }

    const deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;
    
    if (deltaTime > 0) {
      const fps = 1000 / deltaTime;
      this.metrics.fps = fps;
      return fps;
    }
    
    return this.metrics.fps;
  }

  /**
   * Get average frame processing time
   */
  getAverageFrameTime(): number {
    if (this.frameTimeHistory.length === 0) return 0;
    
    const sum = this.frameTimeHistory.reduce((a, b) => a + b, 0);
    return sum / this.frameTimeHistory.length;
  }

  /**
   * Check if performance optimization is needed
   */
  shouldOptimize(): boolean {
    const avgFrameTime = this.getAverageFrameTime();
    const currentFPS = this.metrics.fps;
    
    return (
      avgFrameTime > this.settings.maxFrameProcessingTime ||
      currentFPS < this.settings.targetFPS * 0.8 // 80% of target FPS
    );
  }

  /**
   * Get optimized settings based on current performance
   */
  getOptimizedSettings(): OptimizationSettings {
    const shouldOptimize = this.shouldOptimize();
    
    if (!shouldOptimize) {
      return this.settings;
    }

    const optimizedSettings = { ...this.settings };
    
    // Reduce quality if performance is poor
    if (this.metrics.fps < 20) {
      optimizedSettings.detectionQuality = 'low';
      optimizedSettings.enableFrameSkipping = true;
      optimizedSettings.batchSize = 2; // Process every 2nd frame
    } else if (this.metrics.fps < 25) {
      optimizedSettings.detectionQuality = 'medium';
      optimizedSettings.enableFrameSkipping = true;
      optimizedSettings.batchSize = 1;
    }

    return optimizedSettings;
  }

  /**
   * Optimize frame processing based on current performance
   */
  optimizeFrameProcessing(): {
    shouldSkipFrame: boolean;
    processingInterval: number;
    qualityLevel: 'high' | 'medium' | 'low';
  } {
    const optimizedSettings = this.getOptimizedSettings();
    
    this.frameCount++;
    
    const shouldSkipFrame = optimizedSettings.enableFrameSkipping && 
                           (this.frameCount % optimizedSettings.batchSize !== 0);
    
    const processingInterval = optimizedSettings.enableFrameSkipping ? 
                              optimizedSettings.batchSize * (1000 / this.settings.targetFPS) :
                              (1000 / this.settings.targetFPS);

    return {
      shouldSkipFrame,
      processingInterval,
      qualityLevel: optimizedSettings.detectionQuality
    };
  }

  /**
   * Memory optimization utilities
   */
  optimizeMemory(): void {
    // Clear old frame history
    if (this.frameTimeHistory.length > this.maxHistorySize) {
      this.frameTimeHistory = this.frameTimeHistory.slice(-this.maxHistorySize);
    }

    // Force garbage collection in development
    if (__DEV__ && global.gc) {
      global.gc();
    }
  }

  /**
   * Get performance report
   */
  getPerformanceReport(): {
    currentFPS: number;
    averageFrameTime: number;
    memoryUsage: number;
    optimizationLevel: string;
    recommendations: string[];
  } {
    const avgFrameTime = this.getAverageFrameTime();
    const recommendations: string[] = [];
    
    if (this.metrics.fps < 20) {
      recommendations.push('Consider reducing detection quality');
      recommendations.push('Enable frame skipping');
    }
    
    if (avgFrameTime > 50) {
      recommendations.push('Optimize frame processing pipeline');
    }
    
    if (this.metrics.memoryUsage > 100) {
      recommendations.push('Reduce memory usage');
    }

    let optimizationLevel = 'Good';
    if (this.shouldOptimize()) {
      optimizationLevel = this.metrics.fps < 15 ? 'Critical' : 'Needs Improvement';
    }

    return {
      currentFPS: Math.round(this.metrics.fps),
      averageFrameTime: Math.round(avgFrameTime),
      memoryUsage: Math.round(this.metrics.memoryUsage),
      optimizationLevel,
      recommendations
    };
  }

  /**
   * Reset performance metrics
   */
  reset(): void {
    this.metrics = {
      fps: 0,
      frameProcessingTime: 0,
      memoryUsage: 0,
      detectionLatency: 0
    };
    this.frameCount = 0;
    this.lastFrameTime = 0;
    this.frameTimeHistory = [];
  }

  /**
   * Update settings
   */
  updateSettings(newSettings: Partial<OptimizationSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  /**
   * Get current metrics
   */
  getCurrentMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Get current settings
   */
  getCurrentSettings(): OptimizationSettings {
    return { ...this.settings };
  }
}