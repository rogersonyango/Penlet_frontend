// src/hooks/notes/useNotes.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getNotes } from '../../services/notes/noteServices';

export const useNotes = (params?: Parameters<typeof getNotes>[0]) => {
  return useQuery({
    queryKey: ['notes', params],
    queryFn: () => getNotes(params),
  });
};