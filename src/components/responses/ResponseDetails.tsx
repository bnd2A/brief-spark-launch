
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface ResponseDetailsProps {
  response: {
    answers: {
      question: string;
      answer: string;
    }[];
  };
}

export const ResponseDetails = ({ response }: ResponseDetailsProps) => {
  return (
    <CardContent>
      <div className="space-y-6">
        {response.answers.map((answer, idx) => (
          <div key={idx} className="border-b pb-4 last:border-0">
            <div className="font-medium mb-1">{answer.question}</div>
            <div className="text-muted-foreground whitespace-pre-wrap">{answer.answer}</div>
          </div>
        ))}
      </div>
    </CardContent>
  );
};
