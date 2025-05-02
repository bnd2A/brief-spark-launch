
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2, Trash2, Copy, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BriefWithStats } from '@/hooks/useBriefs';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useBriefs } from '@/hooks/useBriefs';
import { useToast } from '@/hooks/use-toast';

interface BriefCardProps {
  brief: BriefWithStats;
}

const BriefCard: React.FC<BriefCardProps> = ({ brief }) => {
  const navigate = useNavigate();
  const { deleteBrief } = useBriefs();
  const { toast } = useToast();
  
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBrief.mutateAsync(brief.id);
    } catch (error) {
      console.error("Error deleting brief:", error);
    }
  };

  const copyLinkToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/share/${brief.id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied",
      description: "The brief link has been copied to your clipboard."
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="line-clamp-1">{brief.title}</CardTitle>
            <CardDescription className="line-clamp-2 mt-1">
              {brief.description || 'No description'}
            </CardDescription>
          </div>
          {brief.shared && <Share2 size={16} className="text-muted-foreground" />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          <span>Created: {formatDate(brief.created_at)}</span>
          <div className="mt-1 flex items-center">
            <MessageSquare size={14} className="mr-1" />
            <span className="font-medium">{brief.responses_count}</span> {brief.responses_count === 1 ? 'response' : 'responses'}
          </div>
          {brief.sharedBy && (
            <div className="mt-2 flex items-center text-xs">
              <Share2 size={14} className="mr-1" />
              <span>Shared by {brief.sharedBy}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap justify-between gap-2 border-t pt-4 pb-3">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(`/app/edit/${brief.id}`)}
          >
            Edit
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={copyLinkToClipboard}
            className="flex items-center gap-1"
          >
            <Copy size={14} />
            Copy Link
          </Button>
          
          {brief.responses_count > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/app/responses/${brief.id}`)}
              className="flex items-center gap-1"
            >
              <MessageSquare size={14} />
              View Responses
            </Button>
          )}
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 size={16} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the brief
                  "{brief.title}" and all of its associated responses.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        <div className="flex gap-2">
          {brief.responses_count > 0 ? (
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => navigate(`/app/responses/${brief.id}`)}
            >
              View Responses
            </Button>
          ) : (
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => navigate(`/share/${brief.id}`)} 
            >
              View & Share
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default BriefCard;
