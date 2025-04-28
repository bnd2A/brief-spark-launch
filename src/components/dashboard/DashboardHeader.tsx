
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-semibold">Your Briefs</h1>
        <p className="text-muted-foreground">Create and manage your client briefs</p>
      </div>
      <Button onClick={() => navigate('/app/create')} className="flex items-center gap-2">
        <Plus size={18} />
        Create new brief
      </Button>
    </div>
  );
};

export default DashboardHeader;
