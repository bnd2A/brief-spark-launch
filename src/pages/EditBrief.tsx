
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/AppLayout";
import { useToast } from '@/hooks/use-toast';
import { useBriefForm } from '@/hooks/useBriefForm';
import { BriefDetails } from '@/components/brief/BriefDetails';
import { QuestionsList } from '@/components/brief/QuestionsList';
import { BriefPreview } from '@/components/brief/BriefPreview';
import { BriefStyling } from '@/components/brief/BriefStyling';
import { BriefLoading } from '@/components/brief/BriefLoading';
import { EditBriefHeader } from '@/components/brief/EditBriefHeader';
import { useLoadBrief } from '@/hooks/useLoadBrief';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EditBrief = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Load brief data from Supabase
  const { brief, isLoading } = useLoadBrief(id);
  
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

  // Effect to load brief data when it becomes available
  useEffect(() => {
    if (brief) {
      loadBrief(brief);
    }
  }, [brief, loadBrief]);

  const handleSaveAndPreview = () => {
    saveAndPreview();
    toast({
      title: "Brief updated",
      description: "Your brief has been updated successfully.",
    });
  };

  if (isLoading) {
    return <BriefLoading />;
  }

  return (
    <AppLayout>
      <EditBriefHeader 
        title={title} 
        questionsLength={questions.length} 
      />
      
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
