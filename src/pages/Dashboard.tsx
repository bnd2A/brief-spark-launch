
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Share2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useBriefs } from "@/hooks/useBriefs";

// Import our new components
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SearchBar from "@/components/dashboard/SearchBar";
import BriefsGrid from "@/components/dashboard/BriefsGrid";
import EmptyState from "@/components/dashboard/EmptyState";
import LoadingState from "@/components/dashboard/LoadingState";

const Dashboard = () => {
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

  const renderBriefContent = (briefs: any[], isSharedTab: boolean) => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (briefs.length === 0) {
      return <EmptyState hasSearch={!!search} isSharedTab={isSharedTab} />;
    }

    return <BriefsGrid briefs={briefs} />;
  };

  return (
    <AppLayout>
      <DashboardHeader />
      <SearchBar search={search} setSearch={setSearch} />

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
          {renderBriefContent(filteredBriefs, false)}
        </TabsContent>
        
        <TabsContent value="shared-briefs">
          {renderBriefContent(filteredSharedBriefs, true)}
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
};

export default Dashboard;
