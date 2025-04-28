
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { ResponseActions } from './ResponseActions';

export const ResponseHeader = ({ title }: { title: string }) => {
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
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold">{title}</h1>
          <p className="text-muted-foreground">View and export client responses</p>
        </div>
        <ResponseActions />
      </div>
    </div>
  );
};
