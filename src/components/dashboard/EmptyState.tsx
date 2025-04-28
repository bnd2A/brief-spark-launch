
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  hasSearch: boolean;
  isSharedTab: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ hasSearch, isSharedTab }) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-16 bg-muted/40 rounded-lg">
      <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <FileText className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-1">No briefs found</h3>
      <p className="text-muted-foreground mb-4">
        {hasSearch ? 'Try a different search term' : isSharedTab 
          ? 'No briefs have been shared with you yet' 
          : 'Create your first brief to get started'}
      </p>
      {!hasSearch && !isSharedTab && (
        <Button onClick={() => navigate('/app/create')}>
          Create your first brief
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
