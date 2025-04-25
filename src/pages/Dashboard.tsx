
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, FileText } from "lucide-react";
import AppLayout from "@/components/AppLayout";

interface Brief {
  id: string;
  title: string;
  description: string;
  created: string;
  responses: number;
}

const mockBriefs: Brief[] = [
  {
    id: '1',
    title: 'Website Redesign Brief',
    description: 'Collecting requirements for the company website redesign project',
    created: '2025-04-10',
    responses: 3
  },
  {
    id: '2',
    title: 'Logo Design Questionnaire',
    description: 'Questions to understand client brand identity for logo design',
    created: '2025-04-15',
    responses: 1
  },
  {
    id: '3',
    title: 'Mobile App Development',
    description: 'Brief for gathering mobile app functional requirements',
    created: '2025-04-20',
    responses: 0
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [briefs] = useState<Brief[]>(mockBriefs);

  const filteredBriefs = briefs.filter(brief => 
    brief.title.toLowerCase().includes(search.toLowerCase()) || 
    brief.description.toLowerCase().includes(search.toLowerCase())
  );

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
      
      {filteredBriefs.length === 0 ? (
        <div className="text-center py-16 bg-muted/40 rounded-lg">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-1">No briefs found</h3>
          <p className="text-muted-foreground mb-4">
            {search ? 'Try a different search term' : 'Create your first brief to get started'}
          </p>
          {!search && (
            <Button onClick={() => navigate('/app/create')}>
              Create your first brief
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBriefs.map((brief) => (
            <Card key={brief.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle>{brief.title}</CardTitle>
                <CardDescription className="line-clamp-2">{brief.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <span>Created: {new Date(brief.created).toLocaleDateString()}</span>
                  <div className="mt-1">
                    <span className="font-medium">{brief.responses}</span> {brief.responses === 1 ? 'response' : 'responses'}
                  </div>
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
      )}
    </AppLayout>
  );
};

export default Dashboard;
