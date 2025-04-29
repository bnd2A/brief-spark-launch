
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Question } from '@/types/question';
import { useBriefs } from './useBriefs';
import { useToast } from './use-toast';

export interface BriefStyle {
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  backgroundImage?: string;
  headerStyle?: 'default' | 'minimal' | 'branded';
}

export interface Brief {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  style?: BriefStyle;
}

export function useBriefForm(briefId?: string) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createBrief, updateBrief } = useBriefs();

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      type: 'short',
      question: 'What is the name of your project?',
      required: true
    }
  ]);
  const [style, setStyle] = useState<BriefStyle>({
    primaryColor: '#9b87f5',
    secondaryColor: '#f1f0fb',
    fontFamily: 'Inter, sans-serif',
    headerStyle: 'default'
  });

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

  const saveAndPreview = async () => {
    try {
      const briefData = {
        title,
        description,
        questions,
        style
      };

      if (briefId) {
        // Update existing brief
        await updateBrief.mutateAsync({ id: briefId, ...briefData });
        toast({
          title: "Brief updated",
          description: "Your brief has been updated successfully.",
        });
      } else {
        // Create new brief
        await createBrief.mutateAsync(briefData);
        toast({
          title: "Brief created",
          description: "Your brief has been created successfully.",
        });
      }
      
      navigate('/app/dashboard');
    } catch (error) {
      console.error("Error saving brief:", error);
      toast({
        title: "Error",
        description: "There was a problem saving your brief.",
        variant: "destructive"
      });
    }
  };

  const loadBrief = useCallback((brief: Brief) => {
    setTitle(brief.title);
    setDescription(brief.description);
    setQuestions(brief.questions);
    if (brief.style) {
      setStyle(brief.style);
    }
  }, []);

  return {
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
  };
}
