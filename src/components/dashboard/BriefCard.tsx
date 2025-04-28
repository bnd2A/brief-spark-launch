
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Share2 } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BriefWithStats } from '@/hooks/useBriefs';

interface BriefCardProps {
  brief: BriefWithStats;
}

const BriefCard: React.FC<BriefCardProps> = ({ brief }) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
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
          <div className="mt-1">
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
      <CardFooter className="flex justify-between border-t pt-4 pb-3">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(`/app/edit/${brief.id}`)}
        >
          Edit
        </Button>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => navigate(`/share/${brief.id}`)} 
        >
          View & Share
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BriefCard;
