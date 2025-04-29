
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { ShareBriefSheet } from './ShareBriefSheet';

interface EditBriefHeaderProps {
  title: string;
  questionsLength: number;
}

export const EditBriefHeader: React.FC<EditBriefHeaderProps> = ({ 
  title,
  questionsLength
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-6">
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => navigate('/app/dashboard')}
      >
        <ArrowLeft size={18} className="mr-2" /> Back to dashboard
      </Button>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Edit brief</h1>
          <p className="text-muted-foreground">Update your brief details and questions</p>
        </div>
        
        <ShareBriefSheet 
          disabled={!title || questionsLength === 0}
        />
      </div>
    </div>
  );
};
