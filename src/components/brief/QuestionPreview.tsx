
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Question } from '@/types/question';
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface QuestionPreviewProps {
  question: Question;
  primaryColor?: string;
}

export function QuestionPreview({ question, primaryColor = '#9b87f5' }: QuestionPreviewProps) {
  if (!question.question) {
    return null;
  }
  
  // Create a style object for elements that should use the primary color
  const primaryColorStyle = {
    borderColor: primaryColor,
    '--ring': primaryColor,
  } as React.CSSProperties;
  
  if (question.type === 'long') {
    return (
      <div className="pl-4">
        <Label htmlFor="preview-long" className="text-xs mb-1">{question.question}</Label>
        <Textarea 
          id="preview-long"
          disabled 
          placeholder="Long text answer will appear here..." 
          className="resize-none bg-muted/30" 
          style={primaryColorStyle}
        />
      </div>
    );
  }

  if (question.type === 'short') {
    return (
      <div className="pl-4">
        <Label htmlFor="preview-short" className="text-xs mb-1">{question.question}</Label>
        <Input 
          id="preview-short"
          disabled 
          placeholder="Short text answer will appear here..." 
          className="bg-muted/30" 
          style={primaryColorStyle}
        />
      </div>
    );
  }
  
  if (question.type === 'multiple' && question.options && question.options.length > 0) {
    return (
      <div className="pl-4">
        <Label className="text-xs mb-2">{question.question}</Label>
        <RadioGroup disabled className="space-y-1">
          {question.options.map((option, i) => (
            <div key={i} className="flex items-center space-x-2">
              <RadioGroupItem 
                value={option} 
                id={`option-${i}`} 
                disabled 
                style={primaryColorStyle}
              />
              <Label htmlFor={`option-${i}`} className="text-xs">{option}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  }
  
  if (question.type === 'checkbox' && question.options && question.options.length > 0) {
    return (
      <div className="pl-4">
        <Label className="text-xs mb-2">{question.question}</Label>
        <div className="space-y-1">
          {question.options.map((option, i) => (
            <div key={i} className="flex items-center space-x-2">
              <Checkbox 
                id={`check-${i}`} 
                disabled 
                style={primaryColorStyle}
              />
              <Label htmlFor={`check-${i}`} className="text-xs">{option}</Label>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (question.type === 'upload') {
    return (
      <div className="pl-4">
        <Label className="text-xs mb-1">{question.question}</Label>
        <div 
          className="h-20 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/30"
          style={{ borderColor: primaryColor }}
        >
          <div className="text-center text-sm text-muted-foreground">
            File upload field
          </div>
        </div>
      </div>
    );
  }

  return null;
}
