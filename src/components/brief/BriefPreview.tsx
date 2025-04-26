
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Question } from '@/hooks/useBriefForm';

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
      <h2 className="text-xl font-medium mb-4">Brief preview</h2>
      <div className="aspect-[9/16] bg-muted/30 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
        {title ? (
          <div className="w-full h-full p-4 flex flex-col">
            <div className="text-lg font-medium mb-2">{title}</div>
            {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
            <div className="flex-grow overflow-auto">
              {questions.length > 0 && (
                <div className="space-y-4">
                  {questions.slice(0, 3).map((q, i) => (
                    <div key={i} className="bg-background rounded p-3">
                      <div className="text-sm font-medium">{q.question || `Question ${i + 1}`}</div>
                      <div className="h-8 bg-muted/50 rounded mt-2"></div>
                    </div>
                  ))}
                  {questions.length > 3 && (
                    <div className="text-center text-sm text-muted-foreground">
                      + {questions.length - 3} more questions
                    </div>
                  )}
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
          Save and preview
        </Button>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => navigate('/app/dashboard')}
        >
          Cancel
        </Button>
      </div>
    </Card>
  );
}
