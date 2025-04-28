
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, FileText, Share2, Users, Loader2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useBriefs } from "@/hooks/useBriefs";
import { formatDistanceToNow } from 'date-fns';

const Dashboard = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<string>('my-briefs');
  
  const { briefs, isLoading } = useBriefs();
  const sharedBriefs = []; // To be implemented later

  const filteredBriefs = briefs?.filter(brief => 
    brief.title.toLowerCase().includes(search.toLowerCase()) || 
    brief.description?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const filteredSharedBriefs = sharedBriefs?.filter(brief => 
    brief.title.toLowerCase().includes(search.toLowerCase()) || 
    brief.description?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const renderBriefCards = (briefs: any[]) => {
    if (isLoading) {
      return (
        <div className="text-center py-16 bg-muted/40 rounded-lg">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
          </div>
          <h3 className="text-lg font-medium mb-1">Loading briefs...</h3>
        </div>
      );
    }

    if (briefs.length === 0) {
      return (
        <div className="text-center py-16 bg-muted/40 rounded-lg">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">No briefs found</h3>
          <p className="text-muted-foreground mb-4">
            {search ? 'Try a different search term' : 'Create your first brief to get started'}
          </p>
          {!search && activeTab === 'my-briefs' && (
            <Button onClick={() => navigate('/app/create')}>
              Create your first brief
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {briefs.map((brief) => (
          <Card key={brief.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="line-clamp-1">{brief.title}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">{brief.description || 'No description'}</CardDescription>
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
                    <Users size={14} className="mr-1" />
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
        ))}
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Your Briefs</h1>
          <p className="text-muted-foreground">Create and manage your client briefs</p>
        </div>
        <Button onClick={() => navigate('/app/create')} className="flex items-center gap-2">
          <Plus size={18} />
          Create new brief
        </Button>
      </div>
      
      <div className="mb-6 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search briefs..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="my-briefs" className="flex items-center gap-2">
            <FileText size={16} />
            My Briefs
          </TabsTrigger>
          <TabsTrigger value="shared-briefs" className="flex items-center gap-2">
            <Share2 size={16} />
            Shared with me
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-briefs">
          {renderBriefCards(filteredBriefs)}
        </TabsContent>
        
        <TabsContent value="shared-briefs">
          {renderBriefCards(filteredSharedBriefs)}
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default Dashboard;
