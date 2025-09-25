import React, { useState, useEffect } from 'react';
import {
  UsersIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';
import { Typography, Card } from '../components/ui';
import { FilterBar } from '../components/layout/FilterBar';
import { useFilters } from '../contexts/FilterContext';
import { KPICard } from '../components/charts/KPICard';
import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';
import { PieChart } from '../components/charts/PieChart';
import { AreaChart } from '../components/charts/AreaChart';
import { analyticsService } from '../services/analyticsService';
import type { UserAnalytics, SportAnalytics, EngagementMetrics } from '../types';


const AnalyticsPage: React.FC = () => {
  const { selectedSports, dateRange } = useFilters();

  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null);
  const [sportAnalytics, setSportAnalytics] = useState<SportAnalytics | null>(null);
  const [engagementMetrics, setEngagementMetrics] = useState<EngagementMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load analytics data
  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        startDate: dateRange?.start?.toISOString(),
        endDate: dateRange?.end?.toISOString(),
        sports: selectedSports.length > 0 ? selectedSports : undefined
      };

      const [userAnalyticsData, sportAnalyticsData, engagementData] = await Promise.all([
        analyticsService.getUserAnalytics(params),
        analyticsService.getSportAnalytics(params),
        analyticsService.getEngagementMetrics(params)
      ]);

      setUserAnalytics(userAnalyticsData);
      setSportAnalytics(sportAnalyticsData);
      setEngagementMetrics(engagementData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [selectedSports, dateRange]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h1" className="text-gray-900">
            Analytics Dashboard
          </Typography>
          <Typography variant="body1" className="text-gray-600 mt-1">
            Comprehensive insights into user engagement and platform performance
          </Typography>
        </div>
      </div>

      <FilterBar />

      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <Typography variant="body2" className="text-red-800">
            {error}
          </Typography>
        </Card>
      )}

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Users"
          value={userAnalytics?.total_users || 0}
          change={{
            value: userAnalytics?.user_growth_rate || 0,
            period: "vs last month",
            trend: (userAnalytics?.user_growth_rate || 0) > 0 ? 'up' : 'down'
          }}
          icon={<UsersIcon className="w-6 h-6" />}
          loading={loading}
        />

        <KPICard
          title="Active Users"
          value={userAnalytics?.active_users || 0}
          change={{
            value: 12.5,
            period: "vs last week",
            trend: 'up'
          }}
          icon={<ArrowTrendingUpIcon className="w-6 h-6" />}
          loading={loading}
        />

        <KPICard
          title="Total Sessions"
          value={engagementMetrics?.total_sessions || 0}
          change={{
            value: 8.2,
            period: "vs last month",
            trend: 'up'
          }}
          icon={<DevicePhoneMobileIcon className="w-6 h-6" />}
          loading={loading}
        />

        <KPICard
          title="Avg Session Duration"
          value={`${Math.round((engagementMetrics?.average_session_duration || 0) / 60)}m`}
          change={{
            value: 5.1,
            period: "vs last month",
            trend: 'up'
          }}
          icon={<ClockIcon className="w-6 h-6" />}
          loading={loading}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Registration Trend */}
        <LineChart
          title="User Registration Trend"
          subtitle="New user registrations over time"
          data={userAnalytics?.registration_trend || []}
          xAxisKey="date"
          lines={[
            { key: 'value', name: 'New Users', color: '#3182CE' }
          ]}
          loading={loading}
          error={error || undefined}
        />

        {/* Sport Popularity */}
        <BarChart
          title="Sport Popularity"
          subtitle="Users by sport category"
          data={userAnalytics?.users_by_sport || []}
          xAxisKey="sport"
          bars={[
            { key: 'count', name: 'Users', color: '#22C55E' }
          ]}
          loading={loading}
          error={error || undefined}
        />

        {/* User Experience Distribution */}
        <PieChart
          title="User Experience Levels"
          subtitle="Distribution by experience level"
          data={userAnalytics?.users_by_experience || []}
          dataKey="count"
          nameKey="level"
          loading={loading}
          error={error || undefined}
        />

        {/* Session Trend */}
        <AreaChart
          title="Daily Active Users"
          subtitle="User engagement over time"
          data={engagementMetrics?.session_trend || []}
          xAxisKey="date"
          areas={[
            { key: 'value', name: 'Active Users', color: '#8B5CF6' }
          ]}
          loading={loading}
          error={error || undefined}
        />
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Sports Growth */}
        <Card className="p-6">
          <Typography variant="h3" className="mb-4">
            Top Growing Sports
          </Typography>
          <div className="space-y-4">
            {sportAnalytics?.top_sports?.slice(0, 5).map((sport, index) => (
              <div key={sport.sport} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <Typography variant="caption" className="font-medium text-primary-600">
                      {index + 1}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="body2" className="font-medium">
                      {sport.sport}
                    </Typography>
                    <Typography variant="caption" className="text-gray-500">
                      {sport.count} users
                    </Typography>
                  </div>
                </div>
                <div className="text-right">
                  <Typography variant="body2" className="font-medium text-green-600">
                    +{sport.growth}%
                  </Typography>
                </div>
              </div>
            )) || (
                <div className="text-center py-8">
                  <Typography variant="body2" className="text-gray-500">
                    {loading ? 'Loading...' : 'No data available'}
                  </Typography>
                </div>
              )}
          </div>
        </Card>

        {/* User Locations */}
        <Card className="p-6">
          <Typography variant="h3" className="mb-4">
            Top Locations
          </Typography>
          <div className="space-y-4">
            {userAnalytics?.users_by_location?.slice(0, 5).map((location, index) => (
              <div key={location.location} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Typography variant="caption" className="font-medium text-blue-600">
                      {index + 1}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="body2" className="font-medium">
                      {location.location}
                    </Typography>
                    <Typography variant="caption" className="text-gray-500">
                      {location.count} users
                    </Typography>
                  </div>
                </div>
                <div className="text-right">
                  <Typography variant="body2" className="font-medium">
                    {location.percentage}%
                  </Typography>
                </div>
              </div>
            )) || (
                <div className="text-center py-8">
                  <Typography variant="body2" className="text-gray-500">
                    {loading ? 'Loading...' : 'No data available'}
                  </Typography>
                </div>
              )}
          </div>
        </Card>

        {/* Feature Usage */}
        <Card className="p-6">
          <Typography variant="h3" className="mb-4">
            Feature Usage
          </Typography>
          <div className="space-y-4">
            {engagementMetrics?.feature_usage?.slice(0, 5).map((feature, index) => (
              <div key={feature.feature} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Typography variant="caption" className="font-medium text-purple-600">
                      {index + 1}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="body2" className="font-medium">
                      {feature.feature}
                    </Typography>
                  </div>
                </div>
                <div className="text-right">
                  <Typography variant="body2" className="font-medium">
                    {feature.usage_count.toLocaleString()}
                  </Typography>
                </div>
              </div>
            )) || (
                <div className="text-center py-8">
                  <Typography variant="body2" className="text-gray-500">
                    {loading ? 'Loading...' : 'No data available'}
                  </Typography>
                </div>
              )}
          </div>
        </Card>
      </div>

      {/* Engagement Metrics Summary */}
      <Card className="p-6">
        <Typography variant="h3" className="mb-4">
          Engagement Summary
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <Typography variant="h2" className="text-primary-600 mb-1">
              {engagementMetrics?.daily_active_users || 0}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Daily Active Users
            </Typography>
          </div>
          <div className="text-center">
            <Typography variant="h2" className="text-green-600 mb-1">
              {engagementMetrics?.weekly_active_users || 0}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Weekly Active Users
            </Typography>
          </div>
          <div className="text-center">
            <Typography variant="h2" className="text-blue-600 mb-1">
              {engagementMetrics?.monthly_active_users || 0}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Monthly Active Users
            </Typography>
          </div>
          <div className="text-center">
            <Typography variant="h2" className="text-purple-600 mb-1">
              {engagementMetrics?.retention_rate ? `${engagementMetrics.retention_rate}%` : '0%'}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Retention Rate
            </Typography>
          </div>
        </div>
      </Card>
      

    </div>
  );
};

export default AnalyticsPage;