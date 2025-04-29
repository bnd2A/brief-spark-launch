
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Brief } from '@/hooks/useBriefForm';
import { useToast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

export const useLoadBrief = (id: string | undefined) => {
  const { toast } = useToast();

  const { data: brief, isLoading } = useQuery({
    queryKey: ['brief', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('briefs')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error("Error fetching brief:", error);
        toast({
          title: "Error",
          description: "Could not fetch brief details.",
          variant: "destructive"
        });
        throw error;
      }
      
      if (data) {
        // Parse questions array if it's not already an array
        const parsedQuestions = Array.isArray(data.questions) ? 
          data.questions : 
          (typeof data.questions === 'string' ? 
            JSON.parse(data.questions) : []);
        
        return {
          id: data.id,
          title: data.title,
          description: data.description || '',
          questions: parsedQuestions,
          // Explicitly cast style to BriefStyle to resolve TypeScript error
          style: (data.style as any) || {}
        } as Brief;
      }
      
      return null;
    },
    enabled: !!id
  });

  return { 
    brief,
    isLoading 
  };
};
