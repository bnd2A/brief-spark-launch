
import React from 'react';

export const BriefNotFound: React.FC = () => (
  <div className="min-h-screen bg-muted/30 flex items-center justify-center">
    <div className="text-center p-6">
      <h2 className="text-2xl font-bold mb-2">Brief not found</h2>
      <p>The brief you're looking for doesn't exist or has been removed.</p>
    </div>
  </div>
);
