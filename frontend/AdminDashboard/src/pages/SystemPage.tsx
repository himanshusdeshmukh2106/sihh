import React, { useState, useEffect } from 'react';
import {
  ServerIcon,
  CpuChipIcon,
  CircleStackIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { Typography, Card } from '../components/ui';
import { KPICard } from '../components/charts/KPICard';
import { LineChart } from '../components/charts/LineChart';
import { analyticsService } from '../services/analyticsService';
import type { SystemAnalytics } from '../types';

const SystemPage: React.FC = () => {
  const [systemMetrics, setSystemMetrics] = useState<SystemAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load system metrics
  const loadSystemMetrics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await analyticsService.getSystemAnalytics();
      setSystemMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load system metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSystemMetrics();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadSystemMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h1" className="text-gray-900">
            System Monitoring
          </Typography>
          <Typography variant="body1" className="text-gray-600 mt-1">
            Real-time system performance and health metrics
          </Typography>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <ClockIcon className="w-4 h-4" />
          <span>Auto-refresh: 30s</span>
        </div>
      </div>

      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <Typography variant="body2" className="text-red-800">
            {error}
          </Typography>
        </Card>
      )}

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="System Uptime"
          value={`${systemMetrics?.apiMetrics.uptime || 0}%`}
          change={{
            value: 0.1,
            period: "vs last hour",
            trend: 'up'
          }}
          icon={<ServerIcon className="w-6 h-6" />}
          loading={loading}
          variant="success"
        />
        
        <KPICard
          title="Response Time"
          value={`${systemMetrics?.apiMetrics.averageResponseTime || 0}ms`}
          change={{
            value: 5.2,
            period: "vs last hour",
            trend: 'down'
          }}
          icon={<CpuChipIcon className="w-6 h-6" />}
          loading={loading}
        />
        
        <KPICard
          title="Error Rate"
          value={`${systemMetrics?.apiMetrics.errorRate || 0}%`}
          change={{
            value: 0.3,
            period: "vs last hour",
            trend: 'down'
          }}
          icon={<ExclamationTriangleIcon className="w-6 h-6" />}
          loading={loading}
          variant={systemMetrics?.apiMetrics.errorRate && systemMetrics.apiMetrics.errorRate > 5 ? 'error' : 'success'}
        />
        
        <KPICard
          title="DB Connections"
          value={systemMetrics?.databaseMetrics.connectionCount || 0}
          change={{
            value: 2.1,
            period: "vs last hour",
            trend: 'up'
          }}
          icon={<CircleStackIcon className="w-6 h-6" />}
          loading={loading}
        />
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Response Times */}
        <LineChart
          title="API Response Times"
          subtitle="Average response time over the last 24 hours"
          data={[]} // Would be populated from systemMetrics
          xAxisKey="time"
          lines={[
            { key: 'response_time', name: 'Response Time (ms)', color: '#3182CE' }
          ]}
          loading={loading}
          error={error || undefined}
        />

        {/* Error Rate Trend */}
        <LineChart
          title="Error Rate Trend"
          subtitle="Error rate percentage over the last 24 hours"
          data={[]} // Would be populated from systemMetrics
          xAxisKey="time"
          lines={[
            { key: 'error_rate', name: 'Error Rate (%)', color: '#EF4444' }
          ]}
          loading={loading}
          error={error || undefined}
        />
      </div>

      {/* Database Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <Typography variant="h3" className="mb-4">
            Database Performance
          </Typography>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Typography variant="body2" className="text-gray-600">
                Query Performance Score
              </Typography>
              <Typography variant="body2" className="font-medium">
                {systemMetrics?.databaseMetrics.queryPerformance || 0}/100
              </Typography>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${systemMetrics?.databaseMetrics.queryPerformance || 0}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between">
              <Typography variant="body2" className="text-gray-600">
                Storage Used
              </Typography>
              <Typography variant="body2" className="font-medium">
                {systemMetrics?.databaseMetrics.storageUsed || 0} GB / {systemMetrics?.databaseMetrics.storageTotal || 0} GB
              </Typography>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ 
                  width: `${systemMetrics ? (systemMetrics.databaseMetrics.storageUsed / systemMetrics.databaseMetrics.storageTotal) * 100 : 0}%` 
                }}
              ></div>
            </div>
          </div>
        </Card>

        {/* System Alerts */}
        <Card className="p-6">
          <Typography variant="h3" className="mb-4">
            System Alerts
          </Typography>
          <div className="space-y-3">
            {systemMetrics?.performanceAlerts?.length ? (
              systemMetrics.performanceAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <Typography variant="body2" className="font-medium text-yellow-900">
                      {alert.message}
                    </Typography>
                    <Typography variant="caption" className="text-yellow-700">
                      {new Date(alert.timestamp).toLocaleString()}
                    </Typography>
                  </div>
                  {alert.resolved && (
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <Typography variant="body2" className="text-gray-500">
                  {loading ? 'Loading alerts...' : 'No active alerts'}
                </Typography>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* API Endpoints Status */}
      <Card className="p-6">
        <Typography variant="h3" className="mb-4">
          API Endpoints Health
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { endpoint: '/api/v1/admin/auth', status: 'healthy', responseTime: 120 },
            { endpoint: '/api/v1/admin/users', status: 'healthy', responseTime: 180 },
            { endpoint: '/api/v1/admin/videos', status: 'healthy', responseTime: 250 },
            { endpoint: '/api/v1/admin/analytics', status: 'healthy', responseTime: 340 },
            { endpoint: '/api/v1/users', status: 'healthy', responseTime: 150 },
            { endpoint: '/api/v1/items', status: 'warning', responseTime: 450 }
          ].map((endpoint) => (
            <div key={endpoint.endpoint} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <Typography variant="body2" className="font-medium text-gray-900">
                  {endpoint.endpoint}
                </Typography>
                <Typography variant="caption" className="text-gray-500">
                  {endpoint.responseTime}ms
                </Typography>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                endpoint.status === 'healthy' ? 'bg-green-500' : 
                endpoint.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export { SystemPage };