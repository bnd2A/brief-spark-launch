
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Copy } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const ResponseHeader = ({ title }: { title: string }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleExport = (type: 'csv' | 'pdf') => {
    toast({
      title: `Exporting as ${type.toUpperCase()}`,
      description: "Your file is being prepared for download."
    });
    // Implementation for actual export would go here
  };

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
          <p className="text-muted-foreground">View and manage client responses</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('csv')}>
            <Copy size={18} className="mr-2" /> Export as CSV
          </Button>
          <Button onClick={() => handleExport('pdf')}>
            <Download size={18} className="mr-2" /> Export as PDF
          </Button>
        </div>
      </div>
    </div>
  );
};
