
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useToast } from '@/hooks/use-toast';

// Reusing the same component and logic from CreateBrief
import CreateBrief from './CreateBrief';

const EditBrief = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch the brief data from an API
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-accent border-opacity-30 border-t-accent rounded-full mx-auto mb-4"></div>
            <p>Loading brief...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return <CreateBrief />;
};

export default EditBrief;
