
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Brief, BriefStyle } from '@/hooks/useBriefForm';
import { Question } from '@/types/question';
import { Json } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

export interface BriefWithStats extends Brief {
  created_at: string;
  updated_at: string;
  responses_count: number;
  shared?: boolean;
  sharedBy?: string;
}

export const useBriefs = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

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
          style: brief.style as unknown as Json,
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
          questions: brief.questions as unknown as Json,
          style: brief.style as unknown as Json
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

  const deleteBrief = useMutation({
    mutationFn: async (briefId: string) => {
      // First, delete all responses associated with this brief
      const { error: responseError } = await supabase
        .from('brief_responses')
        .delete()
        .eq('brief_id', briefId);
      
      if (responseError) {
        console.error("Error deleting brief responses:", responseError);
        throw responseError;
      }
      
      // Then delete the brief itself
      const { error } = await supabase
        .from('briefs')
        .delete()
        .eq('id', briefId);
      
      if (error) {
        console.error("Error deleting brief:", error);
        throw error;
      }
      
      return briefId;
    },
    onSuccess: (briefId) => {
      queryClient.invalidateQueries({ queryKey: ['briefs'] });
      toast({
        title: "Brief deleted",
        description: "Your brief has been permanently deleted",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete brief. Please try again.",
        variant: "destructive",
      });
    }
  });

  return {
    briefs,
    isLoading,
    createBrief,
    updateBrief,
    deleteBrief
  };
};
