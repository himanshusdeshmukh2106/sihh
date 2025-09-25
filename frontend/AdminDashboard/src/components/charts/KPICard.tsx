import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Typography } from '../ui/Typography';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';
import { cn } from '../../utils/cn';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    period: string;
    trend: 'up' | 'down' | 'neutral';
  };
  icon?: React.ReactNode;
  loading?: boolean;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  icon,
  loading = false,
  className,
  variant = 'default'
}) => {
  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <LoadingSkeleton variant="text" width="60%" height="1rem" />
              <LoadingSkeleton variant="text" width="40%" height="2rem" className="mt-2" />
              <LoadingSkeleton variant="text" width="50%" height="0.875rem" className="mt-2" />
            </div>
            <LoadingSkeleton variant="circular" width="3rem" height="3rem" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const variantStyles = {
    default: 'border-neutral-200',
    success: 'border-success-200 bg-success-50',
    warning: 'border-warning-200 bg-warning-50',
    error: 'border-error-200 bg-error-50'
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return (
          <svg className="w-4 h-4 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
          </svg>
        );
      case 'down':
        return (
          <svg className="w-4 h-4 text-error-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
          </svg>
        );
      case 'neutral':
        return (
          <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        );
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'text-success-600';
      case 'down':
        return 'text-error-600';
      case 'neutral':
        return 'text-neutral-600';
    }
  };

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      // Format large numbers
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <Card className={cn(variantStyles[variant], className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Typography variant="body2" color="secondary" className="mb-1">
              {title}
            </Typography>
            <Typography variant="h3" weight="bold" className="mb-2">
              {formatValue(value)}
            </Typography>
            {change && (
              <div className="flex items-center space-x-1">
                {getTrendIcon(change.trend)}
                <Typography 
                  variant="caption" 
                  className={cn('font-medium', getTrendColor(change.trend))}
                >
                  {change.trend === 'up' ? '+' : change.trend === 'down' ? '-' : ''}
                  {Math.abs(change.value)}%
                </Typography>
                <Typography variant="caption" color="secondary">
                  {change.period}
                </Typography>
              </div>
            )}
          </div>
          {icon && (
            <div className="flex-shrink-0 ml-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                {icon}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};