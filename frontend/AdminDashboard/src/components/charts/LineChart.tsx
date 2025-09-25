import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';
import { Typography } from '../ui/Typography';
import { theme } from '../../styles/theme';

interface LineChartProps {
  data: any[];
  title?: string;
  subtitle?: string;
  height?: number;
  xAxisKey?: string;
  lines?: Array<{
    key: string;
    name: string;
    color?: string;
    strokeWidth?: number;
  }>;
  loading?: boolean;
  error?: string;
  className?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  subtitle,
  height = 300,
  xAxisKey = 'date',
  lines = [{ key: 'value', name: 'Value' }],
  loading = false,
  error,
  className
}) => {
  if (loading) {
    return (
      <Card className={className}>
        {title && (
          <CardHeader>
            <LoadingSkeleton variant="text" width="60%" height="1.5rem" />
            {subtitle && <LoadingSkeleton variant="text" width="40%" height="1rem" />}
          </CardHeader>
        )}
        <CardContent>
          <LoadingSkeleton variant="rectangular" height={`${height}px`} />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            {subtitle && <Typography variant="body2" color="secondary">{subtitle}</Typography>}
          </CardHeader>
        )}
        <CardContent>
          <div className="flex items-center justify-center h-64 text-error-500">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <Typography variant="body2" color="error">{error}</Typography>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            {subtitle && <Typography variant="body2" color="secondary">{subtitle}</Typography>}
          </CardHeader>
        )}
        <CardContent>
          <div className="flex items-center justify-center h-64 text-neutral-400">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <Typography variant="body2" color="secondary">No data available</Typography>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {subtitle && <Typography variant="body2" color="secondary">{subtitle}</Typography>}
        </CardHeader>
      )}
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey={xAxisKey}
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            {lines.length > 1 && <Legend />}
            {lines.map((line, index) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                name={line.name}
                stroke={line.color || theme.colors.chart[index % theme.colors.chart.length]}
                strokeWidth={line.strokeWidth || 2}
                dot={{ fill: line.color || theme.colors.chart[index % theme.colors.chart.length], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};