
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const EditBrief = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [shareEmail, setShareEmail] = useState('');
  const [canEdit, setCanEdit] = useState(false);
  
  const {
    title,
    setTitle,
    description,
    setDescription,
    questions,
    addQuestion,
    updateQuestion,
    removeQuestion,
    handleDragEnd,
    saveAndPreview,
    loadBrief
  } = useBriefForm();

  useEffect(() => {
    // In a real app, this would fetch the brief data from an API
    const mockLoadBrief = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data for the brief with the given ID
      if (id) {
        loadBrief({
          id,
          title: `Example Brief ${id}`,
          description: 'This is a sample brief for editing purposes',
          questions: [
            {
              id: '1',
              type: 'short',
              question: 'What is your name?',
              required: true,
              options: []
            },
            {
              id: '2',
              type: 'long',
              question: 'Describe your project',
              required: false,
              options: []
            }
          ]
        });
      }
      
      setLoading(false);
    };
    
    mockLoadBrief();
  }, [id, loadBrief]);

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

  if (loading) {
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
        </div>
        
        <div>
          <BriefPreview
            title={title}
            description={description}
            questions={questions}
            onSaveAndPreview={handleSaveAndPreview}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default EditBrief;
