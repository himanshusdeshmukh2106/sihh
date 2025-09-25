import React from 'react';
import { Typography } from '../components/ui';

export const UsersPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <Typography variant="h2" className="mb-2">
          User Management
        </Typography>
        <Typography variant="body1" color="secondary">
          Manage user accounts and profiles
        </Typography>
      </div>
      
      <div className="bg-white rounded-xl p-8 text-center">
        <Typography variant="body1" color="secondary">
          User management interface will be implemented in upcoming tasks
        </Typography>
      </div>
    </div>
  );
};