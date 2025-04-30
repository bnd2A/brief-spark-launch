
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { BriefStyle } from '@/hooks/useBriefForm';
import { Upload } from 'lucide-react';

interface BriefQuestionFormProps {
  questions: any[];
  style: BriefStyle;
  onSubmit: (e: React.FormEvent) => void;
}

export const BriefQuestionForm: React.FC<BriefQuestionFormProps> = ({ 
  questions, 
  style,
  onSubmit 
}) => {
  return (
    <form onSubmit={onSubmit} className="p-6 md:p-8 space-y-8">
      {questions.map((question) => (
        <div key={question.id} className="space-y-2">
          <div className="flex items-start">
            <label className="font-medium">
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          </div>
          
          {question.type === 'short' && (
            <Input 
              required={question.required}
              style={{
                borderColor: style.primaryColor,
                '--ring': style.primaryColor,
              } as React.CSSProperties}
            />
          )}
          
          {question.type === 'long' && (
            <Textarea 
              required={question.required} 
              rows={4}
              style={{
                borderColor: style.primaryColor,
                '--ring': style.primaryColor,
              } as React.CSSProperties}
            />
          )}
          
          {question.type === 'multiple' && question.options && (
            <RadioGroup defaultValue={question.options[0]}>
              {question.options.map((option: string, idx: number) => (
                <div key={idx} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={option} 
                    id={`${question.id}-${idx}`}
                    style={{
                      borderColor: style.primaryColor,
                      '--ring': style.primaryColor,
                    } as React.CSSProperties}
                  />
                  <Label htmlFor={`${question.id}-${idx}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}
          
          {question.type === 'checkbox' && question.options && (
            <div className="space-y-2">
              {question.options.map((option: string, idx: number) => (
                <div key={idx} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`${question.id}-${idx}`}
                    style={{
                      borderColor: style.primaryColor,
                      '--ring': style.primaryColor,
                    } as React.CSSProperties}
                  />
                  <label htmlFor={`${question.id}-${idx}`} className="text-sm">{option}</label>
                </div>
              ))}
            </div>
          )}
          
          {question.type === 'upload' && (
            <div className="mt-1">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50" style={{
                  borderColor: style.primaryColor
                }}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PDF, PNG, JPG or DOCX (MAX. 10MB)</p>
                  </div>
                  <input type="file" className="hidden" />
                </label>
              </div>
            </div>
          )}
        </div>
      ))}
      
      <div className="pt-4">
        <Button 
          type="submit" 
          className="w-full md:w-auto"
          style={{
            backgroundColor: style.primaryColor || '#9b87f5',
            color: '#ffffff',
          }}
        >
          Submit brief
        </Button>
      </div>
    </form>
  );
};
