
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { BriefStyle } from '@/hooks/useBriefForm';

interface Brief {
  id: string;
  title: string;
  description: string;
  questions: any[];
  style?: BriefStyle;
}

export const useBriefData = (briefId: string | undefined) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [brief, setBrief] = useState<Brief | null>(null);

  useEffect(() => {
    const fetchBrief = async () => {
      if (!briefId) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('briefs')
          .select('*')
          .eq('id', briefId)
          .single();
          
        if (error) throw error;
        
        // Parse the questions from JSON if needed
        const parsedQuestions = Array.isArray(data.questions) ? 
          data.questions : 
          (typeof data.questions === 'string' ? 
            JSON.parse(data.questions) : []);
        
        // Create a properly structured brief object
        setBrief({
          id: data.id,
          title: data.title,
          description: data.description || '',
          questions: parsedQuestions,
          // Explicitly cast style to BriefStyle to resolve TypeScript error
          style: (data.style as any) || {}
        });
      } catch (error) {
        console.error('Error fetching brief:', error);
        toast({
          title: "Error",
          description: "Could not load the brief.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchBrief();
  }, [briefId, toast]);

  return { brief, loading };
};
