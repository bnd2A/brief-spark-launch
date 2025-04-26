
import React from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { QuestionBlockProps } from '@/types/question';
import { QuestionOptions } from './QuestionOptions';
import { QuestionPreview } from './QuestionPreview';

const QuestionBlock = ({ question, onChange, onRemove }: QuestionBlockProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="p-6">
        <div className="flex items-start gap-3">
          <div 
            {...attributes} 
            {...listeners}
            className="mt-2 cursor-move p-1 hover:bg-accent rounded"
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="flex-grow space-y-4">
            <div>
              <Input
                placeholder="Enter your question"
                value={question.question}
                onChange={(e) => onChange({ question: e.target.value })}
                className="font-medium"
              />
            </div>
            
            {(question.type === 'multiple' || question.type === 'checkbox') && (
              <QuestionOptions question={question} onChange={onChange} />
            )}
            
            <QuestionPreview question={question} />
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center">
            <Switch
              checked={question.required}
              onCheckedChange={(checked) => onChange({ required: checked })}
              id={`required-${question.id}`}
            />
            <label htmlFor={`required-${question.id}`} className="ml-2 text-sm">
              Required
            </label>
          </div>
          
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={onRemove}>
              <Trash2 size={16} className="mr-1" /> Remove
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QuestionBlock;
