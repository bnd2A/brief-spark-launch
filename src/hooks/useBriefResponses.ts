
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Response {
  id: string;
  brief_id: string;
  respondent_email: string | null;
  answers: any;
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
      
      return data as Response[];
    },
    enabled: !!briefId,
    refetchInterval: 30000 // Refetch every 30 seconds to catch new responses
  });

  return {
    brief,
    responses,
    isLoading: briefLoading || responsesLoading
  };
};
