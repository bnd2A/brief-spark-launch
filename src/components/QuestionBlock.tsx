import React, { ReactNode } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Question {
  id: string;
  type: 'short' | 'long' | 'multiple' | 'checkbox' | 'upload';
  question: string;
  required: boolean;
  options?: string[];
}

interface QuestionBlockProps {
  question: Question;
  onChange: (data: Partial<Question>) => void;
  onRemove: () => void;
}

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

  const updateOption = (index: number, value: string) => {
    if (!question.options) return;
    
    const newOptions = [...question.options];
    newOptions[index] = value;
    onChange({ options: newOptions });
  };

  const addOption = () => {
    if (!question.options) return;
    onChange({ options: [...question.options, `Option ${question.options.length + 1}`] });
  };

  const removeOption = (index: number) => {
    if (!question.options || question.options.length <= 2) return;
    
    const newOptions = [...question.options];
    newOptions.splice(index, 1);
    onChange({ options: newOptions });
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
            
            {(question.type === 'multiple' || question.type === 'checkbox') && question.options && (
              <div className="space-y-2 pl-4">
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-4">
                      {question.type === 'multiple' ? (
                        <div className="h-4 w-4 rounded-full border border-muted-foreground/30" />
                      ) : (
                        <div className="h-4 w-4 rounded border border-muted-foreground/30" />
                      )}
                    </div>
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className="flex-grow"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(index)}
                      disabled={question.options.length <= 2}
                      className="h-8 w-8"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
                
                <Button variant="ghost" size="sm" onClick={addOption} className="ml-6">
                  <Plus size={16} className="mr-1" /> Add option
                </Button>
              </div>
            )}
            
            {question.type === 'long' && (
              <div className="pl-4">
                <Textarea disabled placeholder="Long text answer will appear here..." className="resize-none bg-muted/30" />
              </div>
            )}
            
            {question.type === 'short' && (
              <div className="pl-4">
                <Input disabled placeholder="Short text answer will appear here..." className="bg-muted/30" />
              </div>
            )}
            
            {question.type === 'upload' && (
              <div className="pl-4">
                <div className="h-20 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/30">
                  <div className="text-center text-sm text-muted-foreground">
                    File upload field
                  </div>
                </div>
              </div>
            )}
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
