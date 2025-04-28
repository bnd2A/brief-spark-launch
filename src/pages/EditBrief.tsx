
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useToast } from '@/hooks/use-toast';
import { useBriefForm } from '@/hooks/useBriefForm';
import { BriefDetails } from '@/components/brief/BriefDetails';
import { QuestionsList } from '@/components/brief/QuestionsList';
import { BriefPreview } from '@/components/brief/BriefPreview';
import { BriefStyling } from '@/components/brief/BriefStyling';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EditBrief = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [shareEmail, setShareEmail] = useState('');
  const [canEdit, setCanEdit] = useState(false);
  
  const {
    title,
    setTitle,
    description,
    setDescription,
    questions,
    style,
    setStyle,
    addQuestion,
    updateQuestion,
    removeQuestion,
    handleDragEnd,
    saveAndPreview,
    loadBrief
  } = useBriefForm(id);

  // Fetch brief data from Supabase
  const { isLoading } = useQuery({
    queryKey: ['brief', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('briefs')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error("Error fetching brief:", error);
        toast({
          title: "Error",
          description: "Could not fetch brief details.",
          variant: "destructive"
        });
        throw error;
      }
      
      if (data) {
        // Parse questions array if it's not already an array
        const parsedQuestions = Array.isArray(data.questions) ? 
          data.questions : 
          (typeof data.questions === 'string' ? 
            JSON.parse(data.questions) : []);
        
        loadBrief({
          id: data.id,
          title: data.title,
          description: data.description || '',
          questions: parsedQuestions,
          style: data.style || {}
        });
      }
      
      return data;
    },
    enabled: !!id
  });

  const handleSaveAndPreview = () => {
    toast({
      title: "Brief updated",
      description: "Your brief has been updated successfully.",
    });
    saveAndPreview();
  };
  
  const handleShare = () => {
    if (shareEmail) {
      toast({
        title: "Brief shared",
        description: `Your brief has been shared with ${shareEmail}`,
      });
      setShareEmail('');
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-accent border-opacity-30 border-t-accent rounded-full mx-auto mb-4"></div>
            <p>Loading brief...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate('/app/dashboard')}
        >
          <ArrowLeft size={18} className="mr-2" /> Back to dashboard
        </Button>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Edit brief</h1>
            <p className="text-muted-foreground">Update your brief details and questions</p>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                className="self-start sm:self-auto"
                disabled={!title || questions.length === 0}
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
                  <Checkbox id="can-edit" checked={canEdit} onCheckedChange={(checked) => setCanEdit(!!checked)} />
                  <Label htmlFor="can-edit" className="text-sm">Allow editing</Label>
                </div>
              </div>
              
              <SheetFooter className="mt-6">
                <Button onClick={handleShare} disabled={!shareEmail}>Share brief</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="content">
            <TabsList className="mb-6">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="space-y-6">
              <BriefDetails
                title={title}
                description={description}
                onTitleChange={setTitle}
                onDescriptionChange={setDescription}
              />
              
              <QuestionsList
                questions={questions}
                onAddQuestion={addQuestion}
                onUpdateQuestion={updateQuestion}
                onRemoveQuestion={removeQuestion}
                onDragEnd={handleDragEnd}
              />
            </TabsContent>
            
            <TabsContent value="appearance">
              <BriefStyling 
                style={style}
                onChange={setStyle}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <BriefPreview
            title={title}
            description={description}
            questions={questions}
            style={style}
            onSaveAndPreview={handleSaveAndPreview}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default EditBrief;
