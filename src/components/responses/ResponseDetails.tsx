
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FileText, FileDown } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useLoadBrief } from '@/hooks/useLoadBrief';

interface ResponseDetailsProps {
  response: {
    answers: {
      question: string;
      answer: string;
    }[] | any; // Allow for potential non-array type
    respondent_email?: string | null;
    brief_id: string;
  };
}

export const ResponseDetails = ({ response }: ResponseDetailsProps) => {
  const { toast } = useToast();
  const { brief } = useLoadBrief(response.brief_id);

  // Normalize the answers data to ensure it's always an array and map to questions
  const normalizedAnswers = React.useMemo(() => {
    if (!response.answers || !brief) return [];
    
    // Get the questions from the brief
    const briefQuestions = brief.questions || [];
    
    // If it's already an array, try to match with brief questions
    if (Array.isArray(response.answers)) {
      return response.answers.map((answer, index) => {
        // Try to find the corresponding question from the brief
        const matchingQuestion = briefQuestions[index];
        return {
          question: matchingQuestion?.question || answer.question || `Question ${index + 1}`,
          answer: answer.answer
        };
      });
    }
    
    // If it's an object format, try to match keys with brief questions
    if (typeof response.answers === 'object') {
      // Filter out special keys like _clientInfo
      return Object.entries(response.answers)
        .filter(([key]) => !key.startsWith('_'))
        .map(([key, value], index) => {
          // Try to find matching question in brief by index or key
          const matchingQuestion = briefQuestions.find(q => q.id === key) || briefQuestions[index];
          return {
            question: matchingQuestion?.question || `Question ${key}`,
            answer: value as string
          };
        });
    }
    
    return [];
  }, [response.answers, brief]);

  const exportResponse = (format: 'pdf' | 'markdown') => {
    toast({
      title: `Exporting as ${format === 'pdf' ? 'PDF' : 'Markdown'}`,
      description: "Your file is being prepared for download."
    });
    // Actual export implementation would go here in a real app
  };

  return (
    <CardContent>
      {response.respondent_email && (
        <div className="mb-6">
          <div className="text-sm text-muted-foreground">Submitted by</div>
          <div className="font-medium">{response.respondent_email}</div>
          <Separator className="mt-4 mb-6" />
        </div>
      )}
      
      <div className="space-y-6">
        {normalizedAnswers.length > 0 ? (
          normalizedAnswers.map((answer, idx) => (
            <div key={idx} className="border-b pb-4 last:border-0">
              <div className="font-medium mb-1">{answer.question}</div>
              <div className="text-muted-foreground whitespace-pre-wrap">{answer.answer}</div>
            </div>
          ))
        ) : (
          <div className="py-4 text-muted-foreground italic">
            No answer data available or data is in an unexpected format.
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={() => exportResponse('markdown')}>
          <FileDown size={16} className="mr-2" /> Export as Markdown
        </Button>
        <Button onClick={() => exportResponse('pdf')}>
          <FileText size={16} className="mr-2" /> Export as PDF
        </Button>
      </div>
    </CardContent>
  );
};
