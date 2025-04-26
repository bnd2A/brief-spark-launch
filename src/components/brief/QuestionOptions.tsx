
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";
import { Question } from '@/types/question';

interface QuestionOptionsProps {
  question: Question;
  onChange: (data: Partial<Question>) => void;
}

export function QuestionOptions({ question, onChange }: QuestionOptionsProps) {
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
    <div className="space-y-2 pl-4">
      {question.options?.map((option, index) => (
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
  );
}
