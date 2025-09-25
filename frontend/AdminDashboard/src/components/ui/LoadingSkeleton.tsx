import React from 'react';
import { cn } from '../../utils/cn';

export interface LoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const LoadingSkeleton = React.forwardRef<HTMLDivElement, LoadingSkeletonProps>(
  ({ 
    className, 
    variant = 'text', 
    width,
    height,
    lines = 1,
    style,
    ...props 
  }, ref) => {
    const baseStyles = 'animate-pulse bg-neutral-200';
    
    const variants = {
      text: 'rounded',
      circular: 'rounded-full',
      rectangular: 'rounded-lg'
    };

    const defaultSizes = {
      text: { width: '100%', height: '1rem' },
      circular: { width: '2rem', height: '2rem' },
      rectangular: { width: '100%', height: '8rem' }
    };

    const finalStyle = {
      width: width || defaultSizes[variant].width,
      height: height || defaultSizes[variant].height,
      ...style
    };

    if (variant === 'text' && lines > 1) {
      return (
        <div ref={ref} className={cn('space-y-2', className)} {...props}>
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className={cn(baseStyles, variants[variant])}
              style={{
                ...finalStyle,
                width: index === lines - 1 ? '75%' : finalStyle.width
              }}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        style={finalStyle}
        {...props}
      />
    );
  }
);

LoadingSkeleton.displayName = 'LoadingSkeleton';

// Predefined skeleton components for common use cases
export const ChartSkeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('space-y-4', className)} {...props}>
    <LoadingSkeleton variant="text" width="25%" height="1.5rem" />
    <LoadingSkeleton variant="rectangular" height="16rem" />
  </div>
);

export const TableSkeleton = ({ 
  rows = 5, 
  columns = 4, 
  className, 
  ...props 
}: { 
  rows?: number; 
  columns?: number; 
} & React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('space-y-4', className)} {...props}>
    {/* Header */}
    <div className="flex space-x-4">
      {Array.from({ length: columns }).map((_, i) => (
        <LoadingSkeleton key={`header-${i}`} variant="text" height="1rem" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={`row-${rowIndex}`} className="flex space-x-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <LoadingSkeleton key={`cell-${rowIndex}-${colIndex}`} variant="text" height="1rem" />
        ))}
      </div>
    ))}
  </div>
);

export const CardSkeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('p-6 bg-white rounded-xl border border-neutral-100 shadow-soft space-y-4', className)} {...props}>
    <LoadingSkeleton variant="text" width="60%" height="1.5rem" />
    <LoadingSkeleton variant="text" lines={3} />
    <div className="flex space-x-2">
      <LoadingSkeleton variant="rectangular" width="5rem" height="2rem" />
      <LoadingSkeleton variant="rectangular" width="5rem" height="2rem" />
    </div>
  </div>
);

export { LoadingSkeleton };