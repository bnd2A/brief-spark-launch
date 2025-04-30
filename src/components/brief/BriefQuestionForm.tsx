
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { BriefStyle } from '@/hooks/useBriefForm';
import { Upload } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, questionId: string) => {
    try {
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }
      
      const file = e.target.files[0];
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 10MB",
          variant: "destructive"
        });
        return;
      }

      // Initialize progress for this upload
      setUploadProgress(prev => ({ ...prev, [questionId]: 0 }));
      
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `brief-uploads/${fileName}`;
      
      // Create bucket if it doesn't exist
      const { data: bucketData, error: bucketError } = await supabase.storage
        .getBucket('brief-assets');
        
      if (bucketError && bucketError.message.includes('The resource was not found')) {
        const { error: createError } = await supabase.storage.createBucket('brief-assets', {
          public: true
        });
        
        if (createError) {
          throw createError;
        }
      }
      
      // Upload to Supabase Storage with progress tracking
      const { error: uploadError } = await supabase.storage
        .from('brief-assets')
        .upload(filePath, file, {
          onUploadProgress: (progress) => {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            setUploadProgress(prev => ({ ...prev, [questionId]: percent }));
          }
        });
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data } = supabase.storage
        .from('brief-assets')
        .getPublicUrl(filePath);
        
      setUploadedFiles(prev => ({ ...prev, [questionId]: data.publicUrl }));
      
      toast({
        title: "File uploaded",
        description: "Your file has been uploaded successfully."
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your file.",
        variant: "destructive"
      });
    } finally {
      // Reset progress after a few seconds to provide feedback
      setTimeout(() => {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[questionId];
          return newProgress;
        });
      }, 3000);
    }
  };

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
                <label 
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50" 
                  style={{
                    borderColor: style.primaryColor
                  }}
                >
                  {uploadedFiles[question.id] ? (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                        <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium">File uploaded successfully!</p>
                      <p className="text-xs text-muted-foreground mb-4">
                        Click to upload a different file
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PDF, PNG, JPG or DOCX (MAX. 10MB)
                      </p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={(e) => handleFileUpload(e, question.id)}
                  />
                </label>
              </div>
              
              {uploadProgress[question.id] !== undefined && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Uploading...</span>
                    <span>{uploadProgress[question.id]}%</span>
                  </div>
                  <Progress 
                    value={uploadProgress[question.id]} 
                    className="h-2" 
                    style={{
                      '--primary-color': style.primaryColor,
                    } as React.CSSProperties}
                  />
                </div>
              )}
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
