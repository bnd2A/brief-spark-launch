
export interface Question {
  id: string;
  type: 'short' | 'long' | 'multiple' | 'checkbox' | 'upload';
  question: string;
  required: boolean;
  options?: string[];
}

export interface QuestionBlockProps {
  question: Question;
  onChange: (data: Partial<Question>) => void;
  onRemove: () => void;
}
