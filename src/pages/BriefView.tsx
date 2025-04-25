
import React from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/toast';

const mockBrief = {
  id: '1',
  title: 'Website Redesign Brief',
  description: 'Please provide the following information for your website redesign project. This will help us understand your requirements better.',
  questions: [
    {
      id: 'q1',
      type: 'short',
      question: 'What is your company name?',
      required: true
    },
    {
      id: 'q2',
      type: 'long',
      question: 'Describe your business and what you do.',
      required: true
    },
    {
      id: 'q3',
      type: 'multiple',
      question: 'What is the primary goal of your website?',
      required: true,
      options: ['Generate leads', 'Sell products', 'Share information', 'Build brand awareness', 'Other']
    },
    {
      id: 'q4',
      type: 'checkbox',
      question: 'Which features would you like to include on your website?',
      required: false,
      options: ['Blog', 'Portfolio', 'E-commerce', 'Contact form', 'Newsletter signup', 'Member login']
    },
    {
      id: 'q5',
      type: 'upload',
      question: 'Do you have any branding materials or design references to share?',
      required: false
    }
  ]
};

const BriefView = () => {
  const { id } = useParams();
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Brief Submitted",
      description: "Thank you! Your response has been recorded."
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:py-12">
        <div className="text-center mb-8">
          <div className="mb-1">Powered by</div>
          <h2 className="font-bold text-2xl">Briefly</h2>
        </div>
        
        <Card className="overflow-hidden">
          <div className="p-6 md:p-8 bg-accent text-accent-foreground">
            <h1 className="text-2xl font-bold mb-2">{mockBrief.title}</h1>
            <p className="text-accent-foreground/90">{mockBrief.description}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
            {mockBrief.questions.map((question) => (
              <div key={question.id} className="space-y-2">
                <div className="flex items-start">
                  <label className="font-medium">
                    {question.question}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                </div>
                
                {question.type === 'short' && (
                  <Input required={question.required} />
                )}
                
                {question.type === 'long' && (
                  <Textarea required={question.required} rows={4} />
                )}
                
                {question.type === 'multiple' && question.options && (
                  <RadioGroup defaultValue={question.options[0]}>
                    {question.options.map((option, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${question.id}-${idx}`} />
                        <Label htmlFor={`${question.id}-${idx}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
                
                {question.type === 'checkbox' && question.options && (
                  <div className="space-y-2">
                    {question.options.map((option, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <Checkbox id={`${question.id}-${idx}`} />
                        <label htmlFor={`${question.id}-${idx}`} className="text-sm">{option}</label>
                      </div>
                    ))}
                  </div>
                )}
                
                {question.type === 'upload' && (
                  <div className="mt-1">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50">
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
              <Button type="submit" className="w-full md:w-auto">
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
