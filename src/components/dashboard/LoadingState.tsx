
import React from 'react';
import { Loader2 } from "lucide-react";

const LoadingState: React.FC = () => {
  return (
    <div className="text-center py-16 bg-muted/40 rounded-lg">
      <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
      </div>
      <h3 className="text-lg font-medium mb-1">Loading briefs...</h3>
    </div>
  );
};

export default LoadingState;
