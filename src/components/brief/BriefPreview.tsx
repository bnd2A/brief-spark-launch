
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Question } from '@/types/question';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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

  const renderQuestionPreview = (question: Question, index: number) => {
    switch(question.type) {
      case 'short':
        return (
          <div className="p-2 bg-background/80 rounded">
            <p className="text-xs font-medium mb-1">{question.question || `Question ${index + 1}`}</p>
            <div className="h-6 bg-muted/40 rounded w-full"></div>
          </div>
        );
      case 'long':
        return (
          <div className="p-2 bg-background/80 rounded">
            <p className="text-xs font-medium mb-1">{question.question || `Question ${index + 1}`}</p>
            <div className="h-10 bg-muted/40 rounded w-full"></div>
          </div>
        );
      case 'multiple':
        return (
          <div className="p-2 bg-background/80 rounded">
            <p className="text-xs font-medium mb-1">{question.question || `Question ${index + 1}`}</p>
            {question.options && question.options.length > 0 && (
              <div className="space-y-1">
                {question.options.slice(0, 2).map((option, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full border border-muted-foreground/50"></div>
                    <span className="text-xs text-muted-foreground">{option}</span>
                  </div>
                ))}
                {question.options.length > 2 && (
                  <span className="text-xs text-muted-foreground">+ {question.options.length - 2} more options</span>
                )}
              </div>
            )}
          </div>
        );
      case 'checkbox':
        return (
          <div className="p-2 bg-background/80 rounded">
            <p className="text-xs font-medium mb-1">{question.question || `Question ${index + 1}`}</p>
            {question.options && question.options.length > 0 && (
              <div className="space-y-1">
                {question.options.slice(0, 2).map((option, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded border border-muted-foreground/50"></div>
                    <span className="text-xs text-muted-foreground">{option}</span>
                  </div>
                ))}
                {question.options.length > 2 && (
                  <span className="text-xs text-muted-foreground">+ {question.options.length - 2} more options</span>
                )}
              </div>
            )}
          </div>
        );
      case 'upload':
        return (
          <div className="p-2 bg-background/80 rounded">
            <p className="text-xs font-medium mb-1">{question.question || `Question ${index + 1}`}</p>
            <div className="h-6 bg-muted/40 rounded flex items-center justify-center">
              <p className="text-[10px] text-muted-foreground">File upload</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="p-6 sticky top-6">
      <h2 className="text-xl font-medium mb-4">Brief preview</h2>
      <div className="aspect-[9/16] bg-muted/30 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
        {title ? (
          <div className="w-full h-full p-4 flex flex-col">
            <div className="text-lg font-medium mb-2">{title}</div>
            {description && <p className="text-xs text-muted-foreground mb-4">{description}</p>}
            <div className="flex-grow overflow-auto">
              {questions.length > 0 && (
                <div className="space-y-3">
                  {questions.slice(0, 4).map((question, i) => (
                    <div key={i}>
                      {renderQuestionPreview(question, i)}
                    </div>
                  ))}
                  {questions.length > 4 && (
                    <div className="text-center text-xs text-muted-foreground">
                      + {questions.length - 4} more questions
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
