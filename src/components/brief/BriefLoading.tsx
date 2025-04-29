
import React from 'react';

export const BriefLoading: React.FC = () => (
  <div className="min-h-screen bg-muted/30 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin h-8 w-8 border-4 border-accent border-opacity-30 border-t-accent rounded-full mx-auto mb-4"></div>
      <p>Loading brief...</p>
    </div>
  </div>
);
