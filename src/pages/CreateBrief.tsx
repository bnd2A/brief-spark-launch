import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, GripVertical } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import QuestionBlock from '@/components/QuestionBlock';
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface Question {
  id: string;
  type: 'short' | 'long' | 'multiple' | 'checkbox' | 'upload';
  question: string;
  required: boolean;
  options?: string[];
}

const CreateBrief = () => {
  const navigate = useNavigate();
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      type: 'short',
      question: 'What is the name of your project?',
      required: true
    }
  ]);

  const addQuestion = (type: Question['type']) => {
    const newQuestion: Question = {
      id: `${Date.now()}`,
      type,
      question: '',
      required: false
    };
    
    if (type === 'multiple' || type === 'checkbox') {
      newQuestion.options = ['Option 1', 'Option 2'];
    }
    
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, data: Partial<Question>) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, ...data } : q
    ));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const saveAndPreview = () => {
    console.log({
      title,
      description,
      questions
    });
    navigate('/share/preview');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((q) => q.id === active.id);
        const newIndex = items.findIndex((q) => q.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
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
        
        <h1 className="text-3xl font-semibold">Create a new brief</h1>
        <p className="text-muted-foreground">Design your brief with the questions you need answered</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-medium mb-4">Brief details</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
                <Input 
                  id="title"
                  placeholder="e.g. Website Design Brief" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                <Textarea 
                  id="description"
                  placeholder="Briefly describe what this form is for..." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </Card>
          
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Questions</h2>
            
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
              <SortableContext items={questions.map(q => q.id)} strategy={verticalListSortingStrategy}>
                {questions.map((question) => (
                  <QuestionBlock
                    key={question.id}
                    question={question}
                    onChange={(data) => updateQuestion(question.id, data)}
                    onRemove={() => removeQuestion(question.id)}
                  />
                ))}
              </SortableContext>
            </DndContext>
            
            <Card className="p-6 border-dashed flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">Add a new question</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => addQuestion('short')}>
                    <Plus size={16} className="mr-1" /> Short text
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addQuestion('long')}>
                    <Plus size={16} className="mr-1" /> Long text
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addQuestion('multiple')}>
                    <Plus size={16} className="mr-1" /> Multiple choice
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addQuestion('checkbox')}>
                    <Plus size={16} className="mr-1" /> Checkboxes
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addQuestion('upload')}>
                    <Plus size={16} className="mr-1" /> File upload
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        <div>
          <Card className="p-6 sticky top-6">
            <h2 className="text-xl font-medium mb-4">Brief preview</h2>
            <div className="aspect-[9/16] bg-muted/30 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
              {title ? (
                <div className="w-full h-full p-4 flex flex-col">
                  <div className="text-lg font-medium mb-2">{title}</div>
                  {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}
                  <div className="flex-grow overflow-auto">
                    {questions.length > 0 && (
                      <div className="space-y-4">
                        {questions.slice(0, 3).map((q, i) => (
                          <div key={i} className="bg-background rounded p-3">
                            <div className="text-sm font-medium">{q.question || `Question ${i + 1}`}</div>
                            <div className="h-8 bg-muted/50 rounded mt-2"></div>
                          </div>
                        ))}
                        {questions.length > 3 && (
                          <div className="text-center text-sm text-muted-foreground">
                            + {questions.length - 3} more questions
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground text-center p-4">
                  Add brief details to see preview
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <Button className="w-full" disabled={!title || questions.length === 0} onClick={saveAndPreview}>
                Save and preview
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate('/app/dashboard')}>
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default CreateBrief;
