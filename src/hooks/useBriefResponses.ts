
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Response {
  id: string;
  brief_id: string;
  respondent_email: string | null;
  answers: {
    question: string;
    answer: string;
  }[];
  submitted_at: string;
}

interface Brief {
  id: string;
  title: string;
  description: string;
}

export const useBriefResponses = (briefId: string | undefined) => {
  const { toast } = useToast();

  const { data: brief, isLoading: briefLoading } = useQuery({
    queryKey: ['brief-details', briefId],
    queryFn: async () => {
      if (!briefId) return null;
      
      const { data, error } = await supabase
        .from('briefs')
        .select('id, title, description')
        .eq('id', briefId)
        .single();
      
      if (error) {
        console.error('Error fetching brief details:', error);
        return null;
      }
      
      return data as Brief;
    },
    enabled: !!briefId
  });

  const { data: responses, isLoading: responsesLoading } = useQuery({
    queryKey: ['brief-responses', briefId],
    queryFn: async () => {
      if (!briefId) return [];
      
      const { data, error } = await supabase
        .from('brief_responses')
        .select('*')
        .eq('brief_id', briefId)
        .order('submitted_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching responses:', error);
        toast({
          title: "Error",
          description: "Failed to load responses. Please try again.",
          variant: "destructive"
        });
        return [];
      }
      
      // Ensure answers is always an array
      const processedData = data?.map(response => {
        // Log the raw answers for debugging
        console.log('Raw response answers:', response.answers);
        
        // Check if answers is already an array
        if (Array.isArray(response.answers)) {
          return response;
        }
        
        // If answers is an object (might be a JSON string that was parsed), try to convert it to an array
        try {
          // If answers is a string, try to parse it
          if (typeof response.answers === 'string') {
            response.answers = JSON.parse(response.answers);
          }
          
          // If it's an object with numeric keys, convert to array
          if (typeof response.answers === 'object' && response.answers !== null) {
            const answersArray = Object.values(response.answers);
            if (answersArray.length > 0) {
              response.answers = answersArray;
              return response;
            }
          }
          
          // Default case: not a valid answers format
          response.answers = [];
          return response;
        } catch (e) {
          console.error('Error processing response answers:', e);
          response.answers = [];
          return response;
        }
      });
      
      return processedData as Response[];
    },
    enabled: !!briefId
  });

  return {
    brief,
    responses,
    isLoading: briefLoading || responsesLoading
  };
};
