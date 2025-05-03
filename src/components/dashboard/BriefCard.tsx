
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2, Trash2, Copy, MessageSquare, FileText, FileMarkdown, MoreHorizontal } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const exportBrief = (format: 'pdf' | 'markdown') => {
    toast({
      title: `Exporting as ${format === 'pdf' ? 'PDF' : 'Markdown'}`,
      description: "Your file is being prepared for download."
    });
    // Actual export implementation would go here in a real app
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="line-clamp-1">{brief.title}</CardTitle>
                <CardDescription className="line-clamp-2 mt-1">
                  {brief.description || 'No description'}
                </CardDescription>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Brief Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={copyLinkToClipboard}>
                    <Copy size={16} className="mr-2" /> Copy Link
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => exportBrief('pdf')}>
                    <FileText size={16} className="mr-2" /> Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportBrief('markdown')}>
                    <FileMarkdown size={16} className="mr-2" /> Export as Markdown
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleDelete}>
                    <Trash2 size={16} className="mr-2" /> Delete Brief
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {brief.shared && <Share2 size={16} className="text-muted-foreground" />}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <span>Created: {formatDate(brief.created_at)}</span>
              <div className="mt-1 flex items-center">
                <MessageSquare size={14} className="mr-1" />
                <span>{brief.responses_count}</span> {brief.responses_count === 1 ? 'response' : 'responses'}
              </div>
              {brief.sharedBy && (
                <div className="mt-2 text-xs">
                  <span>Shared by {brief.sharedBy}</span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 pb-3 flex justify-between">
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(`/app/edit/${brief.id}`)}
                  >
                    Edit
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit this brief</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
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
                Share
              </Button>
            )}
          </CardFooter>
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={copyLinkToClipboard}>
          <Copy size={16} className="mr-2" /> Copy Link
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => exportBrief('pdf')}>
          <FileText size={16} className="mr-2" /> Export as PDF
        </ContextMenuItem>
        <ContextMenuItem onClick={() => exportBrief('markdown')}>
          <FileMarkdown size={16} className="mr-2" /> Export as Markdown
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
          <Trash2 size={16} className="mr-2" /> Delete Brief
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default BriefCard;
