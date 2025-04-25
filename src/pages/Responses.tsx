
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, Copy } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useToast } from '@/hooks/use-toast';

interface Response {
  id: string;
  submittedAt: string;
  answers: {
    question: string;
    answer: string;
  }[];
}

const mockResponses: Response[] = [
  {
    id: '1',
    submittedAt: '2025-04-22T14:30:00Z',
    answers: [
      {
        question: 'What is your company name?',
        answer: 'Acme Corporation'
      },
      {
        question: 'Describe your business and what you do.',
        answer: 'We are a global leader in innovative technology solutions for various industries including healthcare, finance, and manufacturing.'
      },
      {
        question: 'What is the primary goal of your website?',
        answer: 'Generate leads'
      },
      {
        question: 'Which features would you like to include on your website?',
        answer: 'Blog, Contact form, Newsletter signup'
      }
    ]
  },
  {
    id: '2',
    submittedAt: '2025-04-20T09:15:00Z',
    answers: [
      {
        question: 'What is your company name?',
        answer: 'GreenTech Solutions'
      },
      {
        question: 'Describe your business and what you do.',
        answer: 'We provide sustainable technology solutions for eco-conscious businesses.'
      },
      {
        question: 'What is the primary goal of your website?',
        answer: 'Build brand awareness'
      },
      {
        question: 'Which features would you like to include on your website?',
        answer: 'Portfolio, Blog, Contact form'
      }
    ]
  },
  {
    id: '3',
    submittedAt: '2025-04-15T16:45:00Z',
    answers: [
      {
        question: 'What is your company name?',
        answer: 'Nexus Creative'
      },
      {
        question: 'Describe your business and what you do.',
        answer: 'We are a creative agency focused on branding and digital marketing for small to medium businesses.'
      },
      {
        question: 'What is the primary goal of your website?',
        answer: 'Share information'
      },
      {
        question: 'Which features would you like to include on your website?',
        answer: 'Portfolio, E-commerce'
      }
    ]
  }
];

const Responses = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeResponse, setActiveResponse] = useState<string>(mockResponses[0].id);
  
  const currentResponse = mockResponses.find(r => r.id === activeResponse);
  
  const handleExport = (type: 'pdf' | 'markdown') => {
    toast({
      title: `Exporting as ${type === 'pdf' ? 'PDF' : 'Markdown'}`,
      description: "Your file is being prepared for download."
    });
    // In a real app, this would trigger the export functionality
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Website Redesign Brief</h1>
            <p className="text-muted-foreground">View and export client responses</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport('markdown')}>
              <Copy size={18} className="mr-2" /> Export as Markdown
            </Button>
            <Button onClick={() => handleExport('pdf')}>
              <Download size={18} className="mr-2" /> Export as PDF
            </Button>
          </div>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>
            <Tabs defaultValue={activeResponse} onValueChange={setActiveResponse}>
              <TabsList className="mb-4">
                {mockResponses.map(response => (
                  <TabsTrigger key={response.id} value={response.id}>
                    Response {mockResponses.findIndex(r => r.id === response.id) + 1}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {currentResponse && (
                <div className="text-sm text-muted-foreground">
                  Submitted on {formatDate(currentResponse.submittedAt)}
                </div>
              )}
            </Tabs>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentResponse && (
            <div className="space-y-6">
              {currentResponse.answers.map((answer, idx) => (
                <div key={idx} className="border-b pb-4 last:border-0">
                  <div className="font-medium mb-1">{answer.question}</div>
                  <div className="text-muted-foreground whitespace-pre-wrap">{answer.answer}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default Responses;
