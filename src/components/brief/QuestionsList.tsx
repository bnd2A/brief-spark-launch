
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import QuestionBlock from './QuestionBlock';
import { Question } from '@/types/question';
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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface QuestionsListProps {
  questions: Question[];
  onAddQuestion: (type: Question['type']) => void;
  onUpdateQuestion: (id: string, data: Partial<Question>) => void;
  onRemoveQuestion: (id: string) => void;
  onDragEnd: (event: DragEndEvent) => void;
}

export function QuestionsList({
  questions,
  onAddQuestion,
  onUpdateQuestion,
  onRemoveQuestion,
  onDragEnd
}: QuestionsListProps) {
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">Questions</h2>
      
      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <SortableContext items={questions.map(q => q.id)} strategy={verticalListSortingStrategy}>
          {questions.map((question) => (
            <QuestionBlock
              key={question.id}
              question={question}
              onChange={(data) => onUpdateQuestion(question.id, data)}
              onRemove={() => onRemoveQuestion(question.id)}
            />
          ))}
        </SortableContext>
      </DndContext>
      
      <Card className="p-6 border-dashed flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Add a new question</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onAddQuestion('short')}>
              <Plus size={16} className="mr-1" /> Short text
            </Button>
            <Button variant="outline" size="sm" onClick={() => onAddQuestion('long')}>
              <Plus size={16} className="mr-1" /> Long text
            </Button>
            <Button variant="outline" size="sm" onClick={() => onAddQuestion('multiple')}>
              <Plus size={16} className="mr-1" /> Multiple choice
            </Button>
            <Button variant="outline" size="sm" onClick={() => onAddQuestion('checkbox')}>
              <Plus size={16} className="mr-1" /> Checkboxes
            </Button>
            <Button variant="outline" size="sm" onClick={() => onAddQuestion('upload')}>
              <Plus size={16} className="mr-1" /> File upload
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
