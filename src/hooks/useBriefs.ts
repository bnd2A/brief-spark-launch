
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Brief } from '@/hooks/useBriefForm';
import { Question } from '@/types/question';
import { Json } from '@/integrations/supabase/types';

export interface BriefWithStats extends Brief {
  created_at: string;
  updated_at: string;
  responses_count: number;
}

export const useBriefs = () => {
  const queryClient = useQueryClient();

  const { data: briefs, isLoading } = useQuery({
    queryKey: ['briefs'],
    queryFn: async () => {
      const { data: briefs, error } = await supabase
        .from('briefs')
        .select(`
          *,
          responses:brief_responses(count)
        `)
        .eq('archived', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching briefs:", error);
        throw error;
      }

      return briefs.map(brief => ({
        ...brief,
        responses_count: brief.responses[0]?.count || 0
      }));
    }
  });

  const createBrief = useMutation({
    mutationFn: async (brief: Omit<Brief, 'id'>) => {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('briefs')
        .insert({
          title: brief.title,
          description: brief.description,
          questions: brief.questions as unknown as Json,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating brief:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['briefs'] });
    }
  });

  const updateBrief = useMutation({
    mutationFn: async (brief: Brief) => {
      const { data, error } = await supabase
        .from('briefs')
        .update({
          title: brief.title,
          description: brief.description,
          questions: brief.questions as unknown as Json
        })
        .eq('id', brief.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating brief:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['briefs'] });
    }
  });

  return {
    briefs,
    isLoading,
    createBrief,
    updateBrief
  };
};
