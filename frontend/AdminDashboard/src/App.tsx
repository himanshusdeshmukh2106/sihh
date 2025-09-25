import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/ui';
import { MainLayout } from './components/layout';
import { AuthProvider } from './contexts/AuthContext';
import { FilterProvider } from './contexts/FilterContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { 
  LoginPage, 
  DashboardPage, 
  AnalyticsPage, 
  UsersPage, 
  ContentPage, 
  SystemPage 
} from './pages';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <FilterProvider>
              <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Protected routes */}
              <Route path="/*" element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route index element={<DashboardPage />} />
                
                {/* Analytics routes */}
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="analytics/users" element={<AnalyticsPage />} />
                <Route path="analytics/sports" element={<AnalyticsPage />} />
                <Route path="analytics/engagement" element={<AnalyticsPage />} />
                
                {/* User management */}
                <Route path="users" element={
                  <ProtectedRoute requiredPermissions={[
                    { resource: 'users', actions: ['read'] }
                  ]}>
                    <UsersPage />
                  </ProtectedRoute>
                } />
                
                {/* Content management */}
                <Route path="content" element={<ContentPage />} />
                <Route path="content/videos" element={
                  <ProtectedRoute requiredPermissions={[
                    { resource: 'videos', actions: ['read'] }
                  ]}>
                    <ContentPage />
                  </ProtectedRoute>
                } />
                <Route path="content/moderation" element={
                  <ProtectedRoute requiredPermissions={[
                    { resource: 'videos', actions: ['read', 'write'] }
                  ]}>
                    <ContentPage />
                  </ProtectedRoute>
                } />
                
                {/* System routes */}
                <Route path="system" element={<SystemPage />} />
                <Route path="system/performance" element={
                  <ProtectedRoute requiredPermissions={[
                    { resource: 'system', actions: ['read'] }
                  ]}>
                    <SystemPage />
                  </ProtectedRoute>
                } />
                <Route path="system/logs" element={
                  <ProtectedRoute requiredPermissions={[
                    { resource: 'system', actions: ['read'] }
                  ]}>
                    <SystemPage />
                  </ProtectedRoute>
                } />
              </Route>
              </Routes>
            </FilterProvider>
          </BrowserRouter>
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
