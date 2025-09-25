import React from 'react';
import { cn } from '../../utils/cn';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'overline';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  as?: React.ElementType;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ 
    className, 
    variant = 'body1', 
    color = 'neutral',
    weight,
    as,
    children,
    ...props 
  }, ref) => {
    const variants = {
      h1: 'text-4xl font-bold leading-tight',
      h2: 'text-3xl font-bold leading-tight',
      h3: 'text-2xl font-semibold leading-tight',
      h4: 'text-xl font-semibold leading-tight',
      h5: 'text-lg font-medium leading-tight',
      h6: 'text-base font-medium leading-tight',
      body1: 'text-base leading-relaxed',
      body2: 'text-sm leading-relaxed',
      caption: 'text-xs leading-normal',
      overline: 'text-xs font-medium uppercase tracking-wider leading-normal'
    };

    const colors = {
      primary: 'text-primary-500',
      secondary: 'text-neutral-600',
      success: 'text-success-500',
      warning: 'text-warning-500',
      error: 'text-error-500',
      neutral: 'text-neutral-900'
    };

    const weights = {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold'
    };

    const defaultElements = {
      h1: 'h1',
      h2: 'h2',
      h3: 'h3',
      h4: 'h4',
      h5: 'h5',
      h6: 'h6',
      body1: 'p',
      body2: 'p',
      caption: 'span',
      overline: 'span'
    };

    const Component = as || (defaultElements[variant] as React.ElementType) || 'p';

    return React.createElement(
      Component,
      {
        ref,
        className: cn(
          variants[variant],
          colors[color],
          weight && weights[weight],
          className
        ),
        ...props
      },
      children
    );
  }
);

Typography.displayName = 'Typography';

export { Typography };