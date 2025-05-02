
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Share2, Copy } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';

interface ShareBriefSheetProps {
  disabled: boolean;
  briefId?: string;
}

export const ShareBriefSheet: React.FC<ShareBriefSheetProps> = ({ disabled, briefId }) => {
  const [shareEmail, setShareEmail] = useState('');
  const [canEdit, setCanEdit] = useState(false);
  const { toast } = useToast();

  const handleShare = () => {
    if (shareEmail) {
      toast({
        title: "Brief shared",
        description: `Your brief has been shared with ${shareEmail}`,
      });
      setShareEmail('');
    }
  };

  const copyLinkToClipboard = () => {
    if (briefId) {
      const url = `${window.location.origin}/share/${briefId}`;
      navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied",
        description: "The brief link has been copied to your clipboard."
      });
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          className="self-start sm:self-auto"
          disabled={disabled}
        >
          <Share2 size={18} className="mr-2" /> Share brief
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Share your brief</SheetTitle>
          <SheetDescription>
            Share this brief with team members or clients
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          <div className="flex flex-col space-y-2">
            <Label>Copy public link</Label>
            <div className="flex space-x-2">
              <Input 
                value={briefId ? `${window.location.origin}/share/${briefId}` : ''}
                readOnly
                className="flex-1"
              />
              <Button onClick={copyLinkToClipboard}>
                <Copy size={16} className="mr-2" /> Copy
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="colleague@example.com"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="can-edit" 
              checked={canEdit} 
              onCheckedChange={(checked) => setCanEdit(!!checked)} 
            />
            <Label htmlFor="can-edit" className="text-sm">Allow editing</Label>
          </div>
        </div>
        
        <SheetFooter className="mt-6">
          <Button onClick={handleShare} disabled={!shareEmail}>Share brief</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export function ShareBriefDialog({ disabled, briefId }: { disabled: boolean; briefId?: string }) {
  const { toast } = useToast();
  const [emailMessage, setEmailMessage] = useState('');

  const copyLinkToClipboard = () => {
    if (briefId) {
      const url = `${window.location.origin}/share/${briefId}`;
      navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied",
        description: "The brief link has been copied to your clipboard."
      });
    }
  };

  const handleShare = () => {
    toast({
      title: "Brief shared via email",
      description: "Your brief link has been sent."
    });
    setEmailMessage('');
  };

  const briefUrl = briefId ? `${window.location.origin}/share/${briefId}` : '';

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          <Share2 size={16} className="mr-2" /> Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share brief</DialogTitle>
          <DialogDescription>
            Share this brief with team members or clients
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 mt-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">Link</Label>
            <Input
              id="link"
              readOnly
              value={briefUrl}
            />
          </div>
          <Button variant="secondary" onClick={copyLinkToClipboard} className="px-3">
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy</span>
          </Button>
        </div>
        <div className="mt-4">
          <Label htmlFor="email-message" className="text-sm font-medium">
            Email message (optional)
          </Label>
          <Textarea
            id="email-message"
            placeholder="Add a personal message..."
            value={emailMessage}
            onChange={(e) => setEmailMessage(e.target.value)}
            className="mt-1"
            rows={4}
          />
        </div>
        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="default" onClick={handleShare}>
            Share via Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
