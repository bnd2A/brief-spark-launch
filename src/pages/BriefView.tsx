
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { BriefStyle } from '@/hooks/useBriefForm';

const BriefView = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [brief, setBrief] = useState<{
    id: string;
    title: string;
    description: string;
    questions: any[];
    style?: BriefStyle;
  } | null>(null);
  
  useEffect(() => {
    const fetchBrief = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('briefs')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        // Parse the questions from JSON if needed
        const parsedQuestions = Array.isArray(data.questions) ? 
          data.questions : 
          (typeof data.questions === 'string' ? 
            JSON.parse(data.questions) : []);
        
        // Create a properly structured brief object
        setBrief({
          id: data.id,
          title: data.title,
          description: data.description || '',
          questions: parsedQuestions,
          style: data.style || {}
        });
      } catch (error) {
        console.error('Error fetching brief:', error);
        toast({
          title: "Error",
          description: "Could not load the brief.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchBrief();
  }, [id, toast]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Brief Submitted",
      description: "Thank you! Your response has been recorded."
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-accent border-opacity-30 border-t-accent rounded-full mx-auto mb-4"></div>
          <p>Loading brief...</p>
        </div>
      </div>
    );
  }

  if (!brief) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center p-6">
          <h2 className="text-2xl font-bold mb-2">Brief not found</h2>
          <p>The brief you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const style = brief.style || {};
  
  const customStyles = {
    fontFamily: style.fontFamily || 'Inter, sans-serif',
    '--accent-color': style.primaryColor || '#9b87f5',
    '--bg-color': style.secondaryColor || '#f1f0fb',
  } as React.CSSProperties;

  const headerClasses = {
    default: 'p-6 md:p-8 bg-accent text-accent-foreground',
    minimal: 'p-4 md:p-6 border-b',
    branded: 'p-6 md:p-8 bg-accent text-accent-foreground'
  };

  return (
    <div className="min-h-screen bg-muted/30" style={customStyles}>
      {style.backgroundImage && (
        <div 
          className="fixed inset-0 z-0 opacity-5" 
          style={{ 
            backgroundImage: `url(${style.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }} 
        />
      )}
      
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:py-12 relative z-10">
        <div className="text-center mb-8">
          <div className="mb-1">Powered by</div>
          <h2 className="font-bold text-2xl">Briefly</h2>
        </div>
        
        <Card className="overflow-hidden">
          <div className={headerClasses[style.headerStyle || 'default']} style={{
            backgroundColor: style.headerStyle !== 'minimal' ? style.primaryColor : 'transparent',
            color: style.headerStyle !== 'minimal' ? '#ffffff' : 'inherit'
          }}>
            {style.headerStyle === 'branded' && style.logo && (
              <div className="flex justify-center mb-4">
                <img 
                  src={style.logo} 
                  alt="Brand logo" 
                  className="max-h-16 object-contain" 
                />
              </div>
            )}
            
            <h1 className={`font-bold ${style.headerStyle === 'minimal' ? 'text-xl' : 'text-2xl'} mb-2`}>
              {brief.title}
            </h1>
            <p className={style.headerStyle === 'minimal' ? 'text-muted-foreground text-sm' : ''}>
              {brief.description}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
            {brief.questions.map((question) => (
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
        </Card>
      </div>
    </div>
  );
};

export default BriefView;
