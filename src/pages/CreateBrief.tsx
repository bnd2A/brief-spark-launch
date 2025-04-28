
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useBriefForm } from '@/hooks/useBriefForm';
import { BriefDetails } from '@/components/brief/BriefDetails';
import { QuestionsList } from '@/components/brief/QuestionsList';
import { BriefPreview } from '@/components/brief/BriefPreview';
import { BriefStyling } from '@/components/brief/BriefStyling';
import { useToast } from '@/hooks/use-toast';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CreateBrief = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
    saveAndPreview
  } = useBriefForm();

  const [shareEmail, setShareEmail] = useState('');
  const [canEdit, setCanEdit] = useState(false);

  const handleSaveAndPreview = () => {
    toast({
      title: "Brief saved",
      description: "Your brief has been saved successfully.",
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
            <h1 className="text-3xl font-semibold">Create a new brief</h1>
            <p className="text-muted-foreground">Design your brief with the questions you need answered</p>
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

export default CreateBrief;
