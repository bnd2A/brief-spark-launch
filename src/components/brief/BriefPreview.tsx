import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Question } from '@/types/question';
import { Eye } from "lucide-react";
import { QuestionPreview } from './QuestionPreview';
import { BriefStyle } from '@/hooks/useBriefForm';

interface BriefPreviewProps {
  title: string;
  description: string;
  questions: Question[];
  style?: BriefStyle;
  onSaveAndPreview: () => void;
}

export function BriefPreview({ 
  title, 
  description, 
  questions,
  style = {},
  onSaveAndPreview
}: BriefPreviewProps) {
  const navigate = useNavigate();
  
  const previewStyles = {
    fontFamily: style.fontFamily || 'Inter, sans-serif',
    '--primary-color': style.primaryColor || '#9b87f5',
    '--secondary-color': style.secondaryColor || '#f1f0fb',
  } as React.CSSProperties;

  // Get logo size with a default of 100%
  const logoSize = style.logoSize || 100;

  // Calculate logo position styles
  const getLogoStyles = (): React.CSSProperties => {
    if (!style.logo) return {};
    
    // Default position if not specified
    const position = style.logoPosition || { x: 50, y: 20 };
    
    return {
      position: 'absolute' as const,
      left: `${position.x}%`,
      top: `${position.y}%`,
      transform: 'translate(-50%, -50%)',
      maxHeight: `${logoSize / 3}px`, // Scale down for preview
      zIndex: 10,
    };
  };

  return (
    <Card className="p-6 sticky top-6">
      <h2 className="text-xl font-medium mb-4">Live preview</h2>
      <div className="aspect-[9/16] bg-muted/30 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
        {title ? (
          <div className="w-full h-full p-4 flex flex-col relative" style={previewStyles}>
            {style.headerStyle === 'branded' && style.logo && (
              <div className="flex justify-center mb-3">
                <img src={style.logo} alt="Brand logo" className="h-10 object-contain" />
              </div>
            )}
            
            {style.logo && style.headerStyle !== 'branded' && (
              <img 
                src={style.logo} 
                alt="Brand logo" 
                style={getLogoStyles()}
              />
            )}
            
            <div 
              className="text-lg font-medium mb-2"
              style={style.headerStyle === 'minimal' ? { fontSize: '1rem' } : {}}
            >
              {title}
            </div>
            
            {description && (
              <p 
                className="text-xs text-muted-foreground mb-4"
                style={style.headerStyle === 'minimal' ? { fontSize: '0.75rem' } : {}}
              >
                {description}
              </p>
            )}
            
            <div className="flex-grow overflow-auto pr-1 relative z-10">
              {questions.length > 0 && (
                <div className="space-y-3">
                  {questions.map((question, i) => (
                    <div key={i} className="mb-4">
                      <QuestionPreview question={question} primaryColor={style.primaryColor} />
                    </div>
                  ))}
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
          Save and publish
        </Button>
        
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => navigate('/app/dashboard')}
          >
            Cancel
          </Button>
          
          <Button
            variant="secondary"
            className="w-full"
            disabled={!title || questions.length === 0}
            onClick={() => {
              if (title && questions.length > 0) {
                onSaveAndPreview();
                setTimeout(() => {
                  navigate('/share/preview');
                }, 500);
              }
            }}
          >
            <Eye size={16} className="mr-2" /> Preview
          </Button>
        </div>
      </div>
    </Card>
  );
}
