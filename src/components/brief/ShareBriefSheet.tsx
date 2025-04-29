
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

interface ShareBriefSheetProps {
  disabled: boolean;
}

export const ShareBriefSheet: React.FC<ShareBriefSheetProps> = ({ disabled }) => {
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
