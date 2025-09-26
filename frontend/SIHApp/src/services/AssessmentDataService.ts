/**
 * AssessmentDataService - Handle assessment data persistence and retrieval
 * Uses AsyncStorage for local data storage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AssessmentSession } from '../types';
import { ErrorHandlingService } from './ErrorHandlingService';

const STORAGE_KEYS = {
  ASSESSMENT_SESSIONS: '@assessment_sessions',
  USER_STATS: '@user_stats',
  SETTINGS: '@assessment_settings'
};

export interface UserStats {
  totalSessions: number;
  totalPushups: number;
  bestSession: number;
  totalDuration: number; // in seconds
  averageFormScore: number;
  lastAssessmentDate: Date | null;
}

export interface AssessmentSettings {
  reminderEnabled: boolean;
  targetPushups: number;
  preferredDifficulty: 'beginner' | 'intermediate' | 'advanced';
}

export class AssessmentDataService {
  /**
   * Save an assessment session
   */
  static async saveAssessment(session: AssessmentSession): Promise<void> {
    try {
      // Get existing sessions
      const existingSessions = await this.getAssessmentHistory(session.userId);
      
      // Add new session
      const updatedSessions = [...existingSessions, session];
      
      // Save updated sessions
      await AsyncStorage.setItem(
        `${STORAGE_KEYS.ASSESSMENT_SESSIONS}_${session.userId}`,
        JSON.stringify(updatedSessions)
      );
      
      // Update user stats
      await this.updateUserStats(session.userId, session);
      
      console.log('Assessment session saved successfully:', session.id);
    } catch (error) {
      ErrorHandlingService.handleDataStorageError(
        error as Error,
        {
          showAlert: false,
          customMessage: 'Failed to save assessment session'
        }
      );
      throw new Error('Failed to save assessment data');
    }
  }

  /**
   * Get assessment history for a user
   */
  static async getAssessmentHistory(userId: string): Promise<AssessmentSession[]> {
    try {
      const sessionsJson = await AsyncStorage.getItem(
        `${STORAGE_KEYS.ASSESSMENT_SESSIONS}_${userId}`
      );
      
      if (!sessionsJson) {
        return [];
      }
      
      const sessions = JSON.parse(sessionsJson);
      
      // Convert timestamp strings back to Date objects
      return sessions.map((session: any) => ({
        ...session,
        timestamp: new Date(session.timestamp)
      }));
    } catch (error) {
      console.error('Failed to get assessment history:', error);
      return [];
    }
  }

  /**
   * Get the latest assessment for a user
   */
  static async getLatestAssessment(userId: string): Promise<AssessmentSession | null> {
    try {
      const sessions = await this.getAssessmentHistory(userId);
      
      if (sessions.length === 0) {
        return null;
      }
      
      // Sort by timestamp and return the latest
      const sortedSessions = sessions.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      return sortedSessions[0];
    } catch (error) {
      console.error('Failed to get latest assessment:', error);
      return null;
    }
  }

  /**
   * Get user statistics
   */
  static async getUserStats(userId: string): Promise<UserStats> {
    try {
      const statsJson = await AsyncStorage.getItem(
        `${STORAGE_KEYS.USER_STATS}_${userId}`
      );
      
      if (!statsJson) {
        return {
          totalSessions: 0,
          totalPushups: 0,
          bestSession: 0,
          totalDuration: 0,
          averageFormScore: 0,
          lastAssessmentDate: null
        };
      }
      
      const stats = JSON.parse(statsJson);
      
      // Convert date string back to Date object
      return {
        ...stats,
        lastAssessmentDate: stats.lastAssessmentDate ? new Date(stats.lastAssessmentDate) : null
      };
    } catch (error) {
      console.error('Failed to get user stats:', error);
      return {
        totalSessions: 0,
        totalPushups: 0,
        bestSession: 0,
        totalDuration: 0,
        averageFormScore: 0,
        lastAssessmentDate: null
      };
    }
  }

  /**
   * Update user statistics after a new assessment
   */
  private static async updateUserStats(userId: string, newSession: AssessmentSession): Promise<void> {
    try {
      const currentStats = await this.getUserStats(userId);
      
      const updatedStats: UserStats = {
        totalSessions: currentStats.totalSessions + 1,
        totalPushups: currentStats.totalPushups + newSession.totalPushups,
        bestSession: Math.max(currentStats.bestSession, newSession.totalPushups),
        totalDuration: currentStats.totalDuration + newSession.duration,
        averageFormScore: 0, // TODO: Calculate from form scores when available
        lastAssessmentDate: newSession.timestamp
      };
      
      await AsyncStorage.setItem(
        `${STORAGE_KEYS.USER_STATS}_${userId}`,
        JSON.stringify(updatedStats)
      );
      
      console.log('User stats updated successfully');
    } catch (error) {
      console.error('Failed to update user stats:', error);
    }
  }

  /**
   * Get assessment sessions by date range
   */
  static async getAssessmentsByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<AssessmentSession[]> {
    try {
      const allSessions = await this.getAssessmentHistory(userId);
      
      return allSessions.filter(session => {
        const sessionDate = new Date(session.timestamp);
        return sessionDate >= startDate && sessionDate <= endDate;
      });
    } catch (error) {
      console.error('Failed to get assessments by date range:', error);
      return [];
    }
  }

  /**
   * Get assessment sessions by sport
   */
  static async getAssessmentsBySport(
    userId: string,
    sportId: string
  ): Promise<AssessmentSession[]> {
    try {
      const allSessions = await this.getAssessmentHistory(userId);
      
      return allSessions.filter(session => session.sportId === sportId);
    } catch (error) {
      console.error('Failed to get assessments by sport:', error);
      return [];
    }
  }

  /**
   * Delete an assessment session
   */
  static async deleteAssessment(userId: string, sessionId: string): Promise<void> {
    try {
      const existingSessions = await this.getAssessmentHistory(userId);
      
      const updatedSessions = existingSessions.filter(
        session => session.id !== sessionId
      );
      
      await AsyncStorage.setItem(
        `${STORAGE_KEYS.ASSESSMENT_SESSIONS}_${userId}`,
        JSON.stringify(updatedSessions)
      );
      
      console.log('Assessment session deleted successfully:', sessionId);
    } catch (error) {
      console.error('Failed to delete assessment session:', error);
      throw new Error('Failed to delete assessment data');
    }
  }

  /**
   * Clear all assessment data for a user
   */
  static async clearAllData(userId: string): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        `${STORAGE_KEYS.ASSESSMENT_SESSIONS}_${userId}`,
        `${STORAGE_KEYS.USER_STATS}_${userId}`,
        `${STORAGE_KEYS.SETTINGS}_${userId}`
      ]);
      
      console.log('All assessment data cleared for user:', userId);
    } catch (error) {
      console.error('Failed to clear assessment data:', error);
      throw new Error('Failed to clear assessment data');
    }
  }

  /**
   * Get assessment settings
   */
  static async getSettings(userId: string): Promise<AssessmentSettings> {
    try {
      const settingsJson = await AsyncStorage.getItem(
        `${STORAGE_KEYS.SETTINGS}_${userId}`
      );
      
      if (!settingsJson) {
        return {
          reminderEnabled: true,
          targetPushups: 20,
          preferredDifficulty: 'intermediate'
        };
      }
      
      return JSON.parse(settingsJson);
    } catch (error) {
      console.error('Failed to get assessment settings:', error);
      return {
        reminderEnabled: true,
        targetPushups: 20,
        preferredDifficulty: 'intermediate'
      };
    }
  }

  /**
   * Save assessment settings
   */
  static async saveSettings(userId: string, settings: AssessmentSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(
        `${STORAGE_KEYS.SETTINGS}_${userId}`,
        JSON.stringify(settings)
      );
      
      console.log('Assessment settings saved successfully');
    } catch (error) {
      console.error('Failed to save assessment settings:', error);
      throw new Error('Failed to save settings');
    }
  }

  /**
   * Export assessment data as JSON
   */
  static async exportData(userId: string): Promise<string> {
    try {
      const sessions = await this.getAssessmentHistory(userId);
      const stats = await this.getUserStats(userId);
      const settings = await this.getSettings(userId);
      
      const exportData = {
        userId,
        exportDate: new Date().toISOString(),
        sessions,
        stats,
        settings
      };
      
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Failed to export assessment data:', error);
      throw new Error('Failed to export data');
    }
  }

  /**
   * Get progress analytics
   */
  static async getProgressAnalytics(userId: string): Promise<{
    weeklyProgress: number[];
    monthlyAverage: number;
    improvementRate: number;
    consistencyScore: number;
  }> {
    try {
      const sessions = await this.getAssessmentHistory(userId);
      
      if (sessions.length === 0) {
        return {
          weeklyProgress: [],
          monthlyAverage: 0,
          improvementRate: 0,
          consistencyScore: 0
        };
      }
      
      // Sort sessions by date
      const sortedSessions = sessions.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      
      // Calculate weekly progress (last 7 sessions)
      const recentSessions = sortedSessions.slice(-7);
      const weeklyProgress = recentSessions.map(session => session.totalPushups);
      
      // Calculate monthly average
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const monthlySessions = sessions.filter(session => 
        new Date(session.timestamp) >= thirtyDaysAgo
      );
      
      const monthlyAverage = monthlySessions.length > 0 
        ? monthlySessions.reduce((sum, session) => sum + session.totalPushups, 0) / monthlySessions.length
        : 0;
      
      // Calculate improvement rate (comparing first and last sessions)
      const improvementRate = sortedSessions.length > 1
        ? ((sortedSessions[sortedSessions.length - 1].totalPushups - sortedSessions[0].totalPushups) / sortedSessions[0].totalPushups) * 100
        : 0;
      
      // Calculate consistency score (based on regular assessment frequency)
      const consistencyScore = this.calculateConsistencyScore(sessions);
      
      return {
        weeklyProgress,
        monthlyAverage: Math.round(monthlyAverage),
        improvementRate: Math.round(improvementRate),
        consistencyScore
      };
    } catch (error) {
      console.error('Failed to get progress analytics:', error);
      return {
        weeklyProgress: [],
        monthlyAverage: 0,
        improvementRate: 0,
        consistencyScore: 0
      };
    }
  }

  /**
   * Calculate consistency score based on assessment frequency
   */
  private static calculateConsistencyScore(sessions: AssessmentSession[]): number {
    if (sessions.length < 2) return 0;
    
    const sortedSessions = sessions.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    const intervals: number[] = [];
    for (let i = 1; i < sortedSessions.length; i++) {
      const interval = new Date(sortedSessions[i].timestamp).getTime() - 
                      new Date(sortedSessions[i - 1].timestamp).getTime();
      intervals.push(interval / (1000 * 60 * 60 * 24)); // Convert to days
    }
    
    // Calculate average interval
    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    
    // Score based on ideal interval of 2-3 days
    const idealInterval = 2.5;
    const score = Math.max(0, 100 - Math.abs(avgInterval - idealInterval) * 10);
    
    return Math.round(score);
  }
}