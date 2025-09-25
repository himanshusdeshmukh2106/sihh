import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';
import { Typography } from '../ui/Typography';
import { theme } from '../../styles/theme';

interface PieChartProps {
  data: any[];
  title?: string;
  subtitle?: string;
  height?: number;
  dataKey?: string;
  nameKey?: string;
  colors?: string[];
  loading?: boolean;
  error?: string;
  className?: string;
  showLegend?: boolean;
  innerRadius?: number;
  outerRadius?: number;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  subtitle,
  height = 300,
  dataKey = 'value',
  nameKey = 'name',
  colors = theme.colors.chart,
  loading = false,
  error,
  className,
  showLegend = true,
  innerRadius = 0,
  outerRadius = 80
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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-neutral-200 rounded-lg shadow-lg">
          <Typography variant="body2" weight="medium">
            {data.name}: {data.value}
          </Typography>
          {data.payload.percentage && (
            <Typography variant="caption" color="secondary">
              {data.payload.percentage}%
            </Typography>
          )}
        </div>
      );
    }
    return null;
  };

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
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2}
              dataKey={dataKey}
              nameKey={nameKey}
            >
              {data.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]} 
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            {showLegend && (
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
              />
            )}
          </RechartsPieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};