import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { formatDistanceToNow } from 'date-fns';
import AppLayout from "@/components/AppLayout";
import { ResponseHeader } from '@/components/responses/ResponseHeader';
import { ResponseDetails } from '@/components/responses/ResponseDetails';
import { useBriefResponses } from '@/hooks/useBriefResponses';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Inbox, ArrowRight } from 'lucide-react';

const Responses = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { responses, isLoading, brief } = useBriefResponses(id);
  const [activeResponse, setActiveResponse] = useState<string | null>(
    responses && responses.length > 0 ? responses[0].id : null
  );
  
  const currentResponse = useMemo(() => {
    return responses?.find(r => r.id === activeResponse);
  }, [responses, activeResponse]);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Set the first response as active when responses are loaded
  React.useEffect(() => {
    if (responses && responses.length > 0 && !activeResponse) {
      setActiveResponse(responses[0].id);
    }
  }, [responses, activeResponse]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="mb-6 space-y-4">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4 mb-4" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <div className="p-6 space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </Card>
      </AppLayout>
    );
  }

  if (!brief) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <Inbox size={32} className="text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Brief not found</h2>
          <p className="text-muted-foreground mb-6">
            The brief you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button onClick={() => navigate('/app/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <ResponseHeader title={brief?.title || "Responses"} />
      
      {responses && responses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Response List */}
          <div className="md:col-span-1">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg">
                  All Responses ({responses.length})
                </CardTitle>
              </CardHeader>
              <div className="max-h-[600px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">View</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {responses.map(response => (
                      <TableRow 
                        key={response.id}
                        className={activeResponse === response.id ? 'bg-muted/50' : ''}
                      >
                        <TableCell>
                          <div className="font-medium">
                            {response.respondent_email || 'Anonymous'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(response.submitted_at), { addSuffix: true })}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setActiveResponse(response.id)}
                          >
                            <ArrowRight size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>

          {/* Response Details */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="text-lg">Response Details</div>
                  {currentResponse && (
                    <div className="text-sm text-muted-foreground">
                      Submitted on {formatDate(currentResponse.submitted_at)}
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              {currentResponse && <ResponseDetails response={currentResponse} />}
            </Card>
          </div>
        </div>
      ) : (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <Inbox size={32} className="text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">No responses yet</h2>
          <p className="text-muted-foreground mb-6">
            When clients respond to your brief, their answers will appear here.
          </p>
          <Button onClick={() => navigate(`/share/${id}`)}>
            View & Share Brief
          </Button>
        </div>
      )}
    </AppLayout>
  );
};

export default Responses;
