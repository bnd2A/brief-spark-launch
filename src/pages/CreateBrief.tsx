
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useBriefForm } from '@/hooks/useBriefForm';
import { BriefDetails } from '@/components/brief/BriefDetails';
import { QuestionsList } from '@/components/brief/QuestionsList';
import { BriefPreview } from '@/components/brief/BriefPreview';
import { useToast } from '@/hooks/use-toast';

const CreateBrief = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
    saveAndPreview
  } = useBriefForm();

  const handleSaveAndPreview = () => {
    toast({
      title: "Brief saved",
      description: "Your brief has been saved successfully.",
    });
    saveAndPreview();
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
        
        <h1 className="text-3xl font-semibold">Create a new brief</h1>
        <p className="text-muted-foreground">Design your brief with the questions you need answered</p>
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

export default CreateBrief;
