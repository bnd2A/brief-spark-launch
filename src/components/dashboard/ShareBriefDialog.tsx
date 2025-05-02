
import React, { useState } from 'react';
import { Copy, Mail, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

interface ShareBriefDialogProps {
  briefId: string;
  briefTitle: string;
}

export const ShareBriefDialog: React.FC<ShareBriefDialogProps> = ({ 
  briefId,
  briefTitle
}) => {
  const { toast } = useToast();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState(`Brief: ${briefTitle}`);
  const [emailMessage, setEmailMessage] = useState('Please review and complete this brief at your earliest convenience.');
  
  const baseUrl = window.location.origin;
  const shareableUrl = `${baseUrl}/share/${briefId}`;
  
  const handleCopyLink = async () => {
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
    toast({
      title: "Email sent",
      description: `Your brief has been shared with ${recipientEmail}.`
    });
    
    // Reset form and close dialog
    setRecipientEmail('');
    setEmailSubject(`Brief: ${briefTitle}`);
    setEmailMessage('Please review and complete this brief at your earliest convenience.');
    setShareDialogOpen(false);
  };

  return (
    <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 text-primary bg-primary/5 hover:bg-primary/10 border-primary/20"
        >
          <Share2 size={16} />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share brief</DialogTitle>
          <DialogDescription>
            Share your brief with clients or team members
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="link" className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">Copy Link</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
          </TabsList>
          
          <TabsContent value="link" className="py-4">
            <div className="flex items-center space-x-2">
              <Input
                value={shareableUrl}
                readOnly
                className="flex-1"
              />
              <Button size="sm" onClick={handleCopyLink}>
                <Copy size={16} className="mr-2" />
                Copy
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="email" className="py-4">
            <div className="grid gap-4">
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
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  className="col-span-3"
                  rows={4}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="sm:justify-between">
          <div className="text-xs text-muted-foreground">
            Anyone with the link can view this brief
          </div>
          <div>
            {shareDialogOpen && (
              <Button 
                type="button" 
                variant="default" 
                onClick={handleSendEmail}
                className={`${shareDialogOpen && document.querySelector('[data-value="email"]')?.getAttribute('data-state') !== 'active' ? 'hidden' : ''}`}
              >
                Send Email
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
