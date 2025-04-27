
import React from 'react';
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

export const ResponseActions = () => {
  const { toast } = useToast();

  const handleExport = (type: 'pdf' | 'markdown') => {
    toast({
      title: `Exporting as ${type === 'pdf' ? 'PDF' : 'Markdown'}`,
      description: "Your file is being prepared for download."
    });
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={() => handleExport('markdown')}>
        <Copy size={18} className="mr-2" /> Export as Markdown
      </Button>
      <Button onClick={() => handleExport('pdf')}>
        <Download size={18} className="mr-2" /> Export as PDF
      </Button>
    </div>
  );
};
