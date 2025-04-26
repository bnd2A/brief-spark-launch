
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Question } from '@/types/question';

interface QuestionPreviewProps {
  question: Question;
}

export function QuestionPreview({ question }: QuestionPreviewProps) {
  if (question.type === 'long') {
    return (
      <div className="pl-4">
        <Textarea disabled placeholder="Long text answer will appear here..." className="resize-none bg-muted/30" />
      </div>
    );
  }

  if (question.type === 'short') {
    return (
      <div className="pl-4">
        <Input disabled placeholder="Short text answer will appear here..." className="bg-muted/30" />
      </div>
    );
  }

  if (question.type === 'upload') {
    return (
      <div className="pl-4">
        <div className="h-20 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/30">
          <div className="text-center text-sm text-muted-foreground">
            File upload field
          </div>
        </div>
      </div>
    );
  }

  return null;
}
