
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Question } from '@/types/question';
import { Share2, Eye } from "lucide-react";
import { QuestionPreview } from './QuestionPreview';

interface BriefPreviewProps {
  title: string;
  description: string;
  questions: Question[];
  onSaveAndPreview: () => void;
}

export function BriefPreview({ 
  title, 
  description, 
  questions,
  onSaveAndPreview
}: BriefPreviewProps) {
  const navigate = useNavigate();

  return (
    <Card className="p-6 sticky top-6">
      <h2 className="text-xl font-medium mb-4">Live preview</h2>
      <div className="aspect-[9/16] bg-muted/30 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
        {title ? (
          <div className="w-full h-full p-4 flex flex-col">
            <div className="text-lg font-medium mb-2">{title}</div>
            {description && <p className="text-xs text-muted-foreground mb-4">{description}</p>}
            <div className="flex-grow overflow-auto pr-1">
              {questions.length > 0 && (
                <div className="space-y-3">
                  {questions.map((question, i) => (
                    <div key={i} className="mb-4">
                      <QuestionPreview question={question} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground text-center p-4">
            Add brief details to see preview
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <Button 
          className="w-full" 
          disabled={!title || questions.length === 0} 
          onClick={onSaveAndPreview}
        >
          Save and publish
        </Button>
        
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => navigate('/app/dashboard')}
          >
            Cancel
          </Button>
          
          <Button
            variant="secondary"
            className="w-full"
            disabled={!title || questions.length === 0}
            onClick={() => {
              if (title && questions.length > 0) {
                onSaveAndPreview();
                setTimeout(() => {
                  navigate('/share/preview');
                }, 500);
              }
            }}
          >
            <Eye size={16} className="mr-2" /> Preview
          </Button>
        </div>
      </div>
    </Card>
  );
}
