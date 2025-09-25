import React from 'react';
import { Typography } from '../components/ui';

export const ContentPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <Typography variant="h2" className="mb-2">
          Content Management
        </Typography>
        <Typography variant="body1" color="secondary">
          Manage video content and moderation
        </Typography>
      </div>
      
      <div className="bg-white rounded-xl p-8 text-center">
        <Typography variant="body1" color="secondary">
          Content management interface will be implemented in upcoming tasks
        </Typography>
      </div>
    </div>
  );
};