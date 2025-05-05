
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useBriefData } from '@/hooks/useBriefData';
import { BriefLoading } from '@/components/brief/BriefLoading';
import { BriefNotFound } from '@/components/brief/BriefNotFound';
import { BriefHeader } from '@/components/brief/BriefHeader';
import { BriefQuestionForm } from '@/components/brief/BriefQuestionForm';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BriefView = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { brief, loading } = useBriefData(id);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Brief Submitted",
      description: "Thank you! Your response has been recorded."
    });
  };

  const copyLinkToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied",
      description: "The brief link has been copied to your clipboard."
    });
  };

  if (loading) {
    return <BriefLoading />;
  }

  if (!brief) {
    return <BriefNotFound />;
  }

  const style = brief?.style || {};
  
  const customStyles = {
    fontFamily: style.fontFamily || 'Inter, sans-serif',
    '--accent-color': style.primaryColor || '#9b87f5',
    '--bg-color': style.secondaryColor || '#f1f0fb',
    position: 'relative',
  } as React.CSSProperties;

  // Calculate logo position styles for non-branded header
  const getLogoStyles = () => {
    if (!style.logo || style.headerStyle === 'branded') return {};
    
    // Get position with default if not set
    const position = style.logoPosition || { x: 50, y: 20 };
    const logoSize = style.logoSize || 100;
    
    return {
      position: 'absolute',
      left: `${position.x}%`,
      top: `${position.y}%`,
      transform: 'translate(-50%, -50%)',
      maxHeight: `${logoSize}px`,
      zIndex: 10,
    } as React.CSSProperties;
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
        
        <div className="mb-4 flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={copyLinkToClipboard}
            className="gap-2"
          >
            <Copy size={16} />
            Copy Link
          </Button>
        </div>
        
        <Card className="overflow-hidden">
          {style.logo && style.headerStyle !== 'branded' && (
            <img 
              src={style.logo} 
              alt="Brand logo" 
              style={getLogoStyles()}
              className="absolute z-10"
            />
          )}
          
          <BriefHeader 
            title={brief.title}
            description={brief.description}
            style={style}
          />
          
          <BriefQuestionForm
            questions={brief.questions}
            style={style}
            onSubmit={handleSubmit}
          />
        </Card>
      </div>
    </div>
  );
}

export default BriefView;
