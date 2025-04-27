
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useBriefAnalytics = (briefId: string) => {
  return useQuery({
    queryKey: ['brief-analytics', briefId],
    queryFn: async () => {
      const { data: responses, error } = await supabase
        .from('brief_responses')
        .select('*')
        .eq('brief_id', briefId)
        .order('submitted_at', { ascending: true });

      if (error) throw error;

      // Group responses by date
      const responsesByDate = responses.reduce((acc: Record<string, number>, response) => {
        const date = new Date(response.submitted_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      const responsesOverTime = Object.entries(responsesByDate).map(([date, count]) => ({
        date,
        count
      }));

      return {
        responsesOverTime,
        totalResponses: responses.length,
      };
    }
  });
};
