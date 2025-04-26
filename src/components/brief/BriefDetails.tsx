
import React from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BriefDetailsProps {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export function BriefDetails({ 
  title, 
  description, 
  onTitleChange, 
  onDescriptionChange 
}: BriefDetailsProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-medium mb-4">Brief details</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
          <Input 
            id="title"
            placeholder="e.g. Website Design Brief" 
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
          <Textarea 
            id="description"
            placeholder="Briefly describe what this form is for..." 
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={3}
          />
        </div>
      </div>
    </Card>
  );
}
