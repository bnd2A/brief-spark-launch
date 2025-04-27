
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Question } from '@/types/question';

export interface Brief {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export function useBriefForm() {
  const navigate = useNavigate();
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

  const saveAndPreview = () => {
    console.log({
      title,
      description,
      questions
    });
    navigate('/share/preview');
  };

  const loadBrief = (brief: Brief) => {
    setTitle(brief.title);
    setDescription(brief.description);
    setQuestions(brief.questions);
  };

  return {
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
  };
}
