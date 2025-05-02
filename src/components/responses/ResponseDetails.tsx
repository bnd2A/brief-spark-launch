
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ResponseDetailsProps {
  response: {
    answers: {
      question: string;
      answer: string;
    }[];
    respondent_email?: string | null;
  };
}

export const ResponseDetails = ({ response }: ResponseDetailsProps) => {
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
