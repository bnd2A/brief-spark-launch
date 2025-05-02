
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Question } from '@/types/question';
import { Share2, Eye, Copy, Mail } from "lucide-react";
import { QuestionPreview } from './QuestionPreview';
import { BriefStyle } from '@/hooks/useBriefForm';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
  const { toast } = useToast();
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  
  const previewStyles = {
    fontFamily: style.fontFamily || 'Inter, sans-serif',
    '--primary-color': style.primaryColor || '#9b87f5',
    '--secondary-color': style.secondaryColor || '#f1f0fb',
  } as React.CSSProperties;

  const handleCopyLink = async () => {
    // Get the current URL of the page
    const baseUrl = window.location.origin;
    let shareableUrl;
    
    // Check if we're in create or edit mode
    const currentPath = window.location.pathname;
    if (currentPath.includes('/app/edit/')) {
      // We're in edit mode, extract the brief ID
      const briefId = currentPath.split('/app/edit/')[1];
      shareableUrl = `${baseUrl}/share/${briefId}`;
    } else {
      // We need to save first to get an ID
      onSaveAndPreview();
      // Toast notification to inform user they need to use copy link after saving
      toast({
        title: "Brief saved",
        description: "Please use the Copy Link button again after the brief is saved."
      });
      return;
    }
    
    try {
      await navigator.clipboard.writeText(shareableUrl);
      toast({
        title: "Link copied",
        description: "The brief link has been copied to clipboard."
      });
    } catch (error) {
      console.error("Failed to copy link:", error);
      toast({
        title: "Copy failed",
        description: "Could not copy link. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleSendEmail = () => {
    if (!recipientEmail) {
      toast({
        title: "Email required",
        description: "Please enter a recipient email address.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real implementation, this would send an email with the brief link
    // For now, we'll just show a toast notification
    toast({
      title: "Email sent",
      description: `Your brief has been shared with ${recipientEmail}.`
    });
    
    // Reset form and close dialog
    setRecipientEmail('');
    setEmailSubject('');
    setEmailMessage('');
    setIsEmailDialogOpen(false);
  };

  return (
    <Card className="p-6 sticky top-6">
      <h2 className="text-xl font-medium mb-4">Live preview</h2>
      <div className="aspect-[9/16] bg-muted/30 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
        {title ? (
          <div className="w-full h-full p-4 flex flex-col" style={previewStyles}>
            {style.headerStyle === 'branded' && style.logo && (
              <div className="flex justify-center mb-3">
                <img src={style.logo} alt="Brand logo" className="h-10 object-contain" />
              </div>
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
            
            {style.backgroundImage && (
              <div 
                className="absolute inset-0 z-0 opacity-10" 
                style={{ 
                  backgroundImage: `url(${style.backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }} 
              />
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
        
        {/* New sharing options */}
        <div className="pt-2 border-t">
          <h3 className="text-sm font-medium mb-2">Sharing options</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleCopyLink}
              disabled={!title || questions.length === 0}
            >
              <Copy size={16} className="mr-2" /> Copy Link
            </Button>
            
            <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={!title || questions.length === 0}
                >
                  <Mail size={16} className="mr-2" /> Email
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Share brief via email</DialogTitle>
                  <DialogDescription>
                    Send the brief link directly to your client or team members.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="recipient" className="text-right">
                      To
                    </Label>
                    <Input
                      id="recipient"
                      type="email"
                      placeholder="client@example.com"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="subject" className="text-right">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      placeholder={`Brief: ${title || 'New Brief'}`}
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="message" className="text-right align-top pt-2">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Please review and complete this brief at your earliest convenience."
                      value={emailMessage}
                      onChange={(e) => setEmailMessage(e.target.value)}
                      className="col-span-3"
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSendEmail}>Send Email</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </Card>
  );
}
