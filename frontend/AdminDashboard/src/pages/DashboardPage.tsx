import React from 'react';
import { Typography, Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { FilterBar } from '../components/layout';
import { useFilters } from '../contexts/FilterContext';

export const DashboardPage: React.FC = () => {
  const { selectedSports, hasActiveFilters } = useFilters();

  return (
    <div className="space-y-6">
      <div>
        <Typography variant="h2" className="mb-2">
          Welcome to Sports Admin Dashboard
        </Typography>
        <Typography variant="body1" color="secondary">
          Manage and analyze all aspects of your sports platform
        </Typography>
      </div>

      {/* Filter Bar */}
      <FilterBar 
        showSearch={false}
        searchPlaceholder="Search dashboard..."
      />

      {/* Active filters indicator */}
      {hasActiveFilters && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <Typography variant="body2" color="primary">
            {selectedSports.length > 0 && (
              <>Filtering by {selectedSports.length} sport{selectedSports.length !== 1 ? 's' : ''}: {selectedSports.join(', ')}</>
            )}
          </Typography>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Navigation & Layout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-neutral-600">
              <div>✅ Responsive Sidebar Navigation</div>
              <div>✅ Collapsible Sidebar (Desktop)</div>
              <div>✅ Mobile-Responsive Menu</div>
              <div>✅ Breadcrumb System</div>
              <div>✅ Sport-based Filtering</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Authentication System</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-neutral-600">
              <div>✅ JWT Token Management</div>
              <div>✅ Protected Routes</div>
              <div>✅ Role-based Access Control</div>
              <div>✅ Session Timeout Handling</div>
              <div>✅ Backend Admin Endpoints</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Core Design System</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-neutral-600">
              <div>✅ UI Components (Button, Card, Input, Typography)</div>
              <div>✅ Layout Components (Sidebar, Header, MainLayout)</div>
              <div>✅ Loading Skeletons & Error Boundary</div>
              <div>✅ Filter Components & Context</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-neutral-600">
              <div>🔄 Analytics Data Models & Endpoints</div>
              <div>🔄 Chart Components & Visualization</div>
              <div>🔄 User Management Interface</div>
              <div>🔄 Content Management System</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};