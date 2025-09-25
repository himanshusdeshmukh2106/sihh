import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { Button, Input, Card, CardContent, CardHeader, CardTitle, Typography } from '../components/ui';
import type { LoginCredentials } from '../types';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();
  const location = useLocation();
  
  const from = (location.state as any)?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@sportsapp.com', // Pre-fill for demo
      password: 'admin123', // Pre-fill for demo
    },
  });

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearError();
      await login(data as LoginCredentials);
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">SA</span>
          </div>
          <Typography variant="h3" className="mb-2">
            Sports Admin
          </Typography>
          <Typography variant="body2" color="secondary">
            Sign in to your admin dashboard
          </Typography>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="p-3 bg-error-50 border border-error-200 rounded-lg">
                  <Typography variant="body2" color="error">
                    {error}
                  </Typography>
                </div>
              )}

              <Input
                label="Email"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                placeholder="Enter your email"
                disabled={isSubmitting || isLoading}
              />

              <Input
                label="Password"
                type="password"
                {...register('password')}
                error={errors.password?.message}
                placeholder="Enter your password"
                disabled={isSubmitting || isLoading}
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                loading={isSubmitting || isLoading}
                disabled={isSubmitting || isLoading}
              >
                Sign In
              </Button>
            </form>

            {/* Demo credentials info */}
            <div className="mt-6 p-3 bg-neutral-100 rounded-lg">
              <Typography variant="caption" color="secondary" className="block mb-1">
                Demo Credentials:
              </Typography>
              <Typography variant="caption" color="secondary" className="block">
                Email: admin@sportsapp.com
              </Typography>
              <Typography variant="caption" color="secondary" className="block">
                Password: admin123
              </Typography>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Typography variant="caption" color="secondary">
            © 2024 Sports Platform. All rights reserved.
          </Typography>
        </div>
      </div>
    </div>
  );
};